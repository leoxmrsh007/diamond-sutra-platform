/**
 * 分享组件
 */

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Share2,
  Link2,
  Twitter,
  MessageCircle,
  Mail,
  Copy,
  Check,
  QrCode,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareDialogProps {
  title: string;
  description?: string;
  url?: string;
  trigger?: React.ReactNode;
}

export function ShareDialog({
  title,
  description,
  url: propUrl,
  trigger,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const url = propUrl || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const text = `"${title}" - ${description || '金刚经学习平台'}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const shareToWeChat = () => {
    // 微信分享通常需要使用二维码
    alert('请使用微信扫一扫功能分享');
  };

  const shareToWeibo = () => {
    const text = `${title} - ${description || ''}`;
    window.open(
      `https://service.weibo.com/share/share.php?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const shareToEmail = () => {
    const subject = title;
    const body = `${description || ''}\n\n${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            分享
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-600" />
            分享内容
          </DialogTitle>
          <DialogDescription>
            分享给朋友，一起学习《金刚经》智慧
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* URL Copy */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 p-2 bg-muted rounded text-sm truncate">
                  {url}
                </div>
                <Button
                  size="sm"
                  variant={copied ? 'default' : 'outline'}
                  onClick={handleCopy}
                  className={cn(copied && 'bg-green-500 hover:bg-green-600')}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Platforms */}
          <div>
            <p className="text-sm font-medium mb-3">分享到</p>
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="lg"
                className="flex flex-col gap-1 h-auto py-3 hover:bg-[#E8F5FE] hover:text-[#1976D2] hover:border-[#1976D2]"
                onClick={shareToWeibo}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs">微博</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex flex-col gap-1 h-auto py-3 hover:bg-[#FFF3E0] hover:text-[#F57C00] hover:border-[#F57C00]"
                onClick={shareToWeChat}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs">微信</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex flex-col gap-1 h-auto py-3 hover:bg-[#E8F5FE] hover:text-[#1DA1F2] hover:border-[#1DA1F2]"
                onClick={shareToTwitter}
              >
                <Twitter className="w-5 h-5" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex flex-col gap-1 h-auto py-3 hover:bg-[#F3E8FF] hover:text-[#7E57C2] hover:border-[#7E57C2]"
                onClick={shareToEmail}
              >
                <Mail className="w-5 h-5" />
                <span className="text-xs">邮件</span>
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-muted flex items-center justify-center rounded">
                  <QrCode className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">二维码分享</p>
                  <p className="text-xs text-muted-foreground">
                    扫码即可访问此页面
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 简单的分享按钮组
 */
export function ShareButtons({
  title,
  url,
  className,
}: {
  title: string;
  url?: string;
  className?: string;
}) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const buttons = [
    {
      name: '微博',
      icon: MessageCircle,
      color: 'hover:bg-red-50 hover:text-red-600 hover:border-red-200',
      action: () => {
        window.open(
          `https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      },
    },
    {
      name: '微信',
      icon: MessageCircle,
      color: 'hover:bg-green-50 hover:text-green-600 hover:border-green-200',
      action: () => {
        alert('请使用微信扫一扫功能分享');
      },
    },
    {
      name: '复制链接',
      icon: Link2,
      color: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200',
      action: async () => {
        await navigator.clipboard.writeText(shareUrl);
        // 可以添加 toast 提示
      },
    },
  ];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {buttons.map((btn) => (
        <Button
          key={btn.name}
          variant="outline"
          size="icon"
          onClick={btn.action}
          className={cn('shrink-0', btn.color)}
          title={btn.name}
        >
          <btn.icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
}

/**
 * 浮动分享按钮（常用于移动端）
 */
export function FloatingShareButton({
  title,
  url,
}: {
  title: string;
  url?: string;
}) {
  const [open, setOpen] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button
        size="icon"
        className={cn(
          "w-12 h-12 rounded-full shadow-lg bg-amber-500 hover:bg-amber-600 text-white",
          open && "rotate-45"
        )}
        onClick={() => setOpen(!open)}
      >
        <Share2 className="w-5 h-5" />
      </Button>

      {open && (
        <div className="absolute bottom-14 right-0 flex flex-col gap-2">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-background shadow-md hover:bg-red-50 hover:text-red-600"
            onClick={handleCopy}
            title="复制链接"
          >
            <Link2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-background shadow-md hover:bg-green-50 hover:text-green-600"
            title="微信"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * 分享卡片组件（用于显示分享统计）
 */
export function ShareStats({
  shares,
  comments,
}: {
  shares?: number;
  comments?: number;
}) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Share2 className="w-4 h-4" />
        <span>{shares || 0}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageCircle className="w-4 h-4" />
        <span>{comments || 0}</span>
      </div>
    </div>
  );
}
