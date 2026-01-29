'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, CheckCircle, XCircle, Settings, Info, RefreshCw } from 'lucide-react';

export default function CDNManagementPage() {
  const [status, setStatus] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>('general');
  const [resourceId, setResourceId] = useState<string>('');

  // Fetch CDN status on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/cdn/upload');
      const data = await response.json();
      if (data.success) {
        setStatus(data.status);
      }
    } catch (err) {
      console.error('Failed to fetch CDN status:', err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    if (uploadType !== 'general' && !resourceId) {
      setError('Please provide a resource ID for this upload type');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', uploadType);
    if (uploadType !== 'general') {
      formData.append('id', resourceId);
    }

    try {
      const response = await fetch('/api/cdn/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadResult(data);
        setSelectedFile(null);
        setResourceId('');
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error during upload');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CDN Management</h1>
        <p className="text-muted-foreground">
          Manage CDN configuration and file uploads
        </p>
      </div>

      <Tabs defaultValue="status" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status">
            <Settings className="mr-2 h-4 w-4" />
            Status
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Info className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                CDN Status
                <Button variant="outline" size="sm" onClick={fetchStatus}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>
                Current CDN configuration and connection status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Provider</Label>
                      <p className="text-lg font-semibold capitalize">
                        {status.provider}
                      </p>
                    </div>
                    <div>
                      <Label>Configured</Label>
                      <p className="text-lg font-semibold flex items-center gap-2">
                        {status.configured ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            Yes
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-red-500" />
                            No
                          </>
                        )}
                      </p>
                    </div>
                    <div>
                      <Label>Bucket</Label>
                      <p className="text-sm">{status.bucket}</p>
                    </div>
                    <div>
                      <Label>CDN URL</Label>
                      <p className="text-sm">{status.cdnUrl}</p>
                    </div>
                  </div>

                  {!status.configured && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>CDN Not Configured</AlertTitle>
                      <AlertDescription>
                        CDN is running in local mode. To enable CDN, configure the environment variables in .env.local
                      </AlertDescription>
                    </Alert>
                  )}

                  {status.configured && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>CDN Configured</AlertTitle>
                      <AlertDescription>
                        CDN is properly configured and ready to use.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Loading CDN status...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Upload images and files to CDN
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upload-type">Upload Type</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger id="upload-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Image</SelectItem>
                    <SelectItem value="avatar">User Avatar</SelectItem>
                    <SelectItem value="course">Course Cover</SelectItem>
                    <SelectItem value="sutra">Sutra Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {uploadType !== 'general' && (
                <div className="space-y-2">
                  <Label htmlFor="resource-id">Resource ID</Label>
                  <Input
                    id="resource-id"
                    type="text"
                    placeholder={uploadType === 'avatar' ? 'User ID' : uploadType === 'course' ? 'Course ID' : 'Sutra Slug'}
                    value={resourceId}
                    onChange={(e) => setResourceId(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Accepted formats: JPEG, PNG, WebP, GIF, AVIF. Max size: 10MB
                </p>
              </div>

              {selectedFile && (
                <div className="space-y-2">
                  <Label>Selected File</Label>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{selectedFile.name}</span>
                    <span className="text-muted-foreground">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {uploadResult && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Upload Successful</AlertTitle>
                  <AlertDescription>
                    <div className="space-y-1">
                      <p><strong>URL:</strong> {uploadResult.url}</p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Key:</strong> {uploadResult.key}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="w-full"
              >
                {uploading ? 'Uploading...' : 'Upload to CDN'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CDN Settings</CardTitle>
              <CardDescription>
                Configuration guide for CDN providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Environment Variables</AlertTitle>
                <AlertDescription>
                  To configure CDN, add the following environment variables to your .env.local file.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Cloudflare R2</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm font-mono">
                    <p>CDN_PROVIDER=cloudflare</p>
                    <p>CLOUDFLARE_ACCOUNT_ID=your_account_id</p>
                    <p>CLOUDFLARE_ACCESS_KEY_ID=your_access_key</p>
                    <p>CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key</p>
                    <p>CLOUDFLARE_BUCKET=diamond-sutra-assets</p>
                    <p>CDN_URL=https://your-cdn-url.com</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">AWS S3</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm font-mono">
                    <p>CDN_PROVIDER=aws</p>
                    <p>AWS_ACCESS_KEY_ID=your_aws_key</p>
                    <p>AWS_SECRET_ACCESS_KEY=your_aws_secret</p>
                    <p>AWS_REGION=us-east-1</p>
                    <p>AWS_BUCKET=diamond-sutra-assets</p>
                    <p>CDN_URL=https://your-bucket.s3.amazonaws.com</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Local Mode (Fallback)</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm font-mono">
                    <p>CDN_PROVIDER=local</p>
                    <p>Files will be stored in /public/static</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Next.js Configuration</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Update your next.config.ts to use the CDN configuration:
                </p>
                <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  <pre>{`// Use the CDN config file
next.config.cdn.ts

// Or import into main config
import cdnConfig from './next.config.cdn';
const nextConfig = { ...cdnConfig };`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
