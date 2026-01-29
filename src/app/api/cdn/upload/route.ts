import { NextRequest, NextResponse } from 'next/server';
import { cdnService, generateImageKey, generateAvatarKey, generateCourseCoverKey } from '@/lib/cdn';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'general'; // 'general', 'avatar', 'course', 'sutra'
    const id = formData.get('id') as string || 'unknown';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: JPEG, PNG, WebP, GIF, AVIF' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate key based on type
    let key: string;
    switch (type) {
      case 'avatar':
        key = generateAvatarKey(id, file.name);
        break;
      case 'course':
        key = generateCourseCoverKey(id, file.name);
        break;
      case 'sutra':
        key = generateSutraImageKey(id, file.name);
        break;
      default:
        key = generateImageKey(file.name);
    }

    // Upload to CDN
    const result = await cdnService.uploadImage(key, buffer, file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      etag: result.etag,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Get CDN status
export async function GET() {
  try {
    const status = cdnService.getStatus();

    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error('CDN status error:', error);
    return NextResponse.json(
      { error: 'Failed to get CDN status' },
      { status: 500 }
    );
  }
}
