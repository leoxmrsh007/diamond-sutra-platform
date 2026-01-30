/**
 * CDN Service for managing file uploads and CDN operations
 * Supports multiple providers: Cloudflare R2, AWS S3, Vercel Blob
 */

// 动态导入 AWS SDK，避免在构建时出错
let S3Client: any;
let PutObjectCommand: any;
let GetObjectCommand: any;
let DeleteObjectCommand: any;

try {
  const awsSdk = require('@aws-sdk/client-s3');
  S3Client = awsSdk.S3Client;
  PutObjectCommand = awsSdk.PutObjectCommand;
  GetObjectCommand = awsSdk.GetObjectCommand;
  DeleteObjectCommand = awsSdk.DeleteObjectCommand;
} catch (e) {
  console.warn('AWS SDK not available, CDN service will run in local mode');
}

export type CDNProvider = 'cloudflare' | 'aws' | 'vercel' | 'local';

export interface CDNConfig {
  provider: CDNProvider;
  bucket: string;
  endpoint?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  cdnUrl?: string;
}

export interface UploadOptions {
  contentType: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  url: string;
  key: string;
  etag?: string;
}

class CDNService {
  private config: CDNConfig;
  private s3Client: any | null = null;

  constructor() {
    this.config = {
      provider: (process.env.CDN_PROVIDER as CDNProvider) || 'local',
      bucket: process.env.CLOUDFLARE_BUCKET || process.env.AWS_BUCKET || 'diamond-sutra-assets',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      region: process.env.AWS_REGION || 'auto',
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
      cdnUrl: process.env.CDN_URL || '/static',
    };

    this.initializeClient();
  }

  private initializeClient() {
    if (this.config.provider === 'local') {
      console.log('CDN Service initialized in local mode');
      return;
    }

    if (!this.config.accessKeyId || !this.config.secretAccessKey) {
      console.warn('CDN credentials not configured, falling back to local mode');
      this.config.provider = 'local';
      return;
    }

    if (!S3Client) {
      console.warn('AWS SDK not available, falling back to local mode');
      this.config.provider = 'local';
      return;
    }

    this.s3Client = new S3Client({
      region: this.config.region,
      endpoint: this.config.endpoint,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });

    console.log(`CDN Service initialized with provider: ${this.config.provider}`);
  }

  /**
   * Upload a file to CDN
   */
  async uploadFile(
    key: string,
    body: Buffer | string | Uint8Array,
    options: UploadOptions
  ): Promise<UploadResult> {
    try {
      if (this.config.provider === 'local') {
        return this.uploadLocal(key, body, options);
      }

      if (!this.s3Client) {
        throw new Error('S3 client not initialized');
      }

      if (!PutObjectCommand) {
        throw new Error('AWS SDK not available');
      }
      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: body,
        ContentType: options.contentType,
        CacheControl: options.cacheControl || 'public, max-age=31536000, immutable',
        Metadata: options.metadata,
      });

      const response = await this.s3Client.send(command);
      const url = this.generateUrl(key);

      return {
        url,
        key,
        etag: response.ETag,
      };
    } catch (error) {
      console.error('CDN upload error:', error);
      throw new Error(`Failed to upload file to CDN: ${error}`);
    }
  }

  /**
   * Upload an image with optimization
   */
  async uploadImage(
    key: string,
    buffer: Buffer,
    mimeType: string
  ): Promise<UploadResult> {
    const cacheControl = 'public, max-age=31536000, immutable';
    
    return this.uploadFile(key, buffer, {
      contentType: mimeType,
      cacheControl,
      metadata: {
        'uploaded-at': new Date().toISOString(),
        'content-type': mimeType,
      },
    });
  }

  /**
   * Get a file from CDN
   */
  async getFile(key: string): Promise<Buffer | null> {
    try {
      if (this.config.provider === 'local') {
        // In local mode, we can't retrieve files from static storage
        return null;
      }

      if (!this.s3Client) {
        throw new Error('S3 client not initialized');
      }

      if (!GetObjectCommand) {
        throw new Error('AWS SDK not available');
      }
      const command = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      
      if (response.Body) {
        const chunks: Uint8Array[] = [];
        const stream = response.Body as any;
        
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        
        return Buffer.concat(chunks);
      }

      return null;
    } catch (error) {
      console.error('CDN get file error:', error);
      return null;
    }
  }

  /**
   * Delete a file from CDN
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      if (this.config.provider === 'local') {
        // Local files can't be deleted via CDN service
        return true;
      }

      if (!this.s3Client) {
        throw new Error('S3 client not initialized');
      }

      if (!DeleteObjectCommand) {
        throw new Error('AWS SDK not available');
      }
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error('CDN delete file error:', error);
      return false;
    }
  }

  /**
   * Generate CDN URL for a file
   */
  generateUrl(key: string): string {
    if (this.config.provider === 'local') {
      return `/static/${key}`;
    }

    const cdnUrl = this.config.cdnUrl || '';
    return `${cdnUrl}/${key}`.replace(/\/+/g, '/');
  }

  /**
   * Generate unique key for file
   */
  generateKey(prefix: string, filename: string, uniqueId?: string): string {
    const timestamp = Date.now();
    const randomStr = uniqueId || Math.random().toString(36).substring(2, 15);
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    return `${prefix}/${timestamp}-${randomStr}-${cleanFilename}`;
  }

  /**
   * Local upload fallback
   */
  private async uploadLocal(
    key: string,
    body: Buffer | string | Uint8Array,
    options: UploadOptions
  ): Promise<UploadResult> {
    // In local mode, we just return a static path
    // In production, you'd want to save the file to the filesystem
    const url = this.generateUrl(key);
    
    return {
      url,
      key,
    };
  }

  /**
   * Get CDN configuration status
   */
  getStatus() {
    return {
      provider: this.config.provider,
      bucket: this.config.bucket,
      endpoint: this.config.endpoint,
      cdnUrl: this.config.cdnUrl,
      configured: this.config.provider !== 'local' && !!this.s3Client,
    };
  }
}

// Export singleton instance
export const cdnService = new CDNService();

/**
 * Helper function to generate image key
 */
export function generateImageKey(filename: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `images/${timestamp}-${randomStr}-${cleanFilename}`;
}

/**
 * Helper function to generate avatar key
 */
export function generateAvatarKey(userId: string, filename: string): string {
  const timestamp = Date.now();
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `avatars/${userId}/${timestamp}-${cleanFilename}`;
}

/**
 * Helper function to generate course cover key
 */
export function generateCourseCoverKey(courseId: string, filename: string): string {
  const timestamp = Date.now();
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `courses/${courseId}/${timestamp}-${cleanFilename}`;
}

/**
 * Helper function to generate sutra image key
 */
export function generateSutraImageKey(sutraSlug: string, filename: string): string {
  const timestamp = Date.now();
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `sutras/${sutraSlug}/${timestamp}-${cleanFilename}`;
}
