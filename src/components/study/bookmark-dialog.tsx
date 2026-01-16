/**
 * 书签对话框组件
 */

'use client';

import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bookmark,
  BookmarkCheck,
  BookmarkX,
  Search,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export interface BookmarkItem {
  id: string;
  verse: string;
  verseId: string;
  chapter: string;
  note?: string;
  createdAt: string;
}

type ApiBookmarkResponse = {
  id: string;
  verseId: string;
  verse?: string | null;
  chapter?: string | null;
  note?: string | null;
  createdAt?: string | Date;
};

const isApiBookmarkResponse = (value: unknown): value is ApiBookmarkResponse => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === 'string' && typeof candidate.verseId === 'string';
};

const normalizeBookmark = (bookmark: ApiBookmarkResponse): BookmarkItem => ({
  id: bookmark.id,
  verseId: bookmark.verseId,
  verse: bookmark.verse ?? '',
  chapter: bookmark.chapter ?? '',
  note: bookmark.note ?? undefined,
  createdAt: bookmark.createdAt ? new Date(bookmark.createdAt).toISOString().split('T')[0] : '',
});

interface BookmarkDialogProps {
  verseId: string;
  verse: string;
  chapter: string;
  isBookmarked?: boolean;
  onToggle?: (bookmarked: boolean, note?: string) => void;
  trigger?: React.ReactNode;
}

// 模拟书签数据（作为未登录或 API 不可用的回退）
const mockBookmarks: BookmarkItem[] = [
  {
    id: '1',
    verse: '所有一切众生之类，我皆令入无余涅槃而灭度之',
    verseId: '3-1',
    chapter: '第三分',
    note: '菩萨的大愿心',
    createdAt: '2024-01-18',
  },
  {
    id: '2',
    verse: '如来者，无所从来，亦无所去',
    verseId: '29-1',
    chapter: '第二十九分',
    note: '法身的真实含义',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    verse: '菩萨于法，应无所住行于布施',
    verseId: '4-1',
    chapter: '第四分',
    note: '三轮体空的布施',
    createdAt: '2024-01-12',
  },
  {
    id: '4',
    verse: '一切有为法，如梦幻泡影，如露亦如电，应作如是观',
    verseId: '32-1',
    chapter: '第三十二分',
    note: '',
    createdAt: '2024-01-10',
  },
];

export function BookmarkDialog({
  verseId,
  verse,
  chapter,
  isBookmarked: externalIsBookmarked,
  onToggle,
  trigger,
}: BookmarkDialogProps) {
  const [open, setOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(externalIsBookmarked || false);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/bookmarks?verseId=${encodeURIComponent(verseId)}`);
        if (res.ok) {
          const data: unknown = await res.json();
          if (Array.isArray(data)) {
            const normalized = data.filter(isApiBookmarkResponse).map(normalizeBookmark);
            setBookmarks(normalized);
            const existing = normalized.find((b) => b.verseId === verseId);
            setIsBookmarked(Boolean(existing));
            if (existing?.note) setBookmarkNote(existing.note);
          }
        } else {
          const existing = mockBookmarks.find((b) => b.verseId === verseId);
          setIsBookmarked(!!existing);
          if (existing?.note) setBookmarkNote(existing.note);
          setBookmarks(mockBookmarks);
        }
      } catch {
        const existing = mockBookmarks.find((b) => b.verseId === verseId);
        setIsBookmarked(!!existing);
        if (existing?.note) setBookmarkNote(existing.note);
        setBookmarks(mockBookmarks);
      }
    })();
  }, [verseId]);

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      // 移除书签（优先调用 API，失败回退本地）
      (async () => {
        try {
          const res = await fetch(`/api/bookmarks?verseId=${encodeURIComponent(verseId)}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('failed');
        } catch {}
        setBookmarks((prev) => prev.filter((b) => b.verseId !== verseId));
        setIsBookmarked(false);
        if (onToggle) onToggle(false);
      })();
    } else {
      // 添加书签（优先调用 API，失败回退本地）
      (async () => {
        try {
          const res = await fetch(`/api/bookmarks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ verseId, note: bookmarkNote }),
          });
          if (!res.ok) throw new Error('failed');
        } catch {}
        const newBookmark: BookmarkItem = {
          id: Date.now().toString(),
          verse,
          verseId,
          chapter,
          note: bookmarkNote,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setBookmarks((prev) => [...prev, newBookmark]);
        setIsBookmarked(true);
        if (onToggle) onToggle(true, bookmarkNote);
      })();
    }
  };

  const handleUpdateNote = () => {
    setBookmarks((prev) =>
      prev.map((b) => (b.verseId === verseId ? { ...b, note: bookmarkNote } : b))
    );
    setIsAddingNote(false);
    if (onToggle) onToggle(true, bookmarkNote);
  };

  const handleDelete = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    if (id === verseId) {
      setIsBookmarked(false);
    }
  };

  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.verse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.note && b.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={isBookmarked ? "default" : "outline"} size="sm">
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 mr-2" />
            ) : (
              <Bookmark className="w-4 h-4 mr-2" />
            )}
            {isBookmarked ? '已收藏' : '收藏'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-600" />
            我的收藏
          </DialogTitle>
          <DialogDescription>
            收藏您喜欢的偈颂，方便日后复习
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-[60vh]">
          {/* Current Verse Action */}
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 mb-4">
            <p className="text-sm text-muted-foreground mb-1">{chapter}</p>
            <p className="font-medium mb-3 line-clamp-2">{verse}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleToggleBookmark}
                className={isBookmarked ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkX className="w-4 h-4 mr-2" />
                    取消收藏
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    添加到收藏
                  </>
                )}
              </Button>
              {isBookmarked && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddingNote(!isAddingNote)}
                >
                  {bookmarkNote ? '编辑笔记' : '添加笔记'}
                </Button>
              )}
            </div>
            {isAddingNote && isBookmarked && (
              <div className="mt-3 flex gap-2">
                <Input
                  placeholder="为这个书签添加备注..."
                  value={bookmarkNote}
                  onChange={(e) => setBookmarkNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUpdateNote()}
                />
                <Button size="sm" onClick={handleUpdateNote}>
                  保存
                </Button>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索收藏..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Bookmarks List */}
          <ScrollArea className="flex-1">
            <div className="space-y-3 pr-4">
              {filteredBookmarks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{searchQuery ? '没有找到相关收藏' : '还没有收藏任何偈颂'}</p>
                </div>
              ) : (
                filteredBookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      bookmark.verseId === verseId ? 'border-amber-500 bg-amber-50' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Badge variant="outline" className="mb-2">
                          {bookmark.chapter}
                        </Badge>
                        <p className="font-medium text-sm mb-2 line-clamp-2">{bookmark.verse}</p>
                        {bookmark.note && (
                          <p className="text-sm text-muted-foreground flex items-start gap-1">
                            <Bookmark className="w-3 h-3 mt-0.5 shrink-0" />
                            {bookmark.note}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">{bookmark.createdAt}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(bookmark.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center pt-4 border-t text-sm text-muted-foreground">
          <span>共 {bookmarks.length} 个收藏</span>
          <Button variant="outline" size="sm" asChild>
            <a href="/profile?tab=bookmarks">查看全部</a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 书签列表组件 - 用于侧边栏
 */
export function BookmarkList({
  bookmarks,
  onSelect,
  currentId,
}: {
  bookmarks: BookmarkItem[];
  onSelect?: (verseId: string) => void;
  currentId?: string;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = bookmarks.filter(
    (b) =>
      b.verse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.chapter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="搜索收藏..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2 pr-4">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery ? '没有找到相关收藏' : '还没有收藏任何偈颂'}
            </div>
          ) : (
            filtered.map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() => onSelect?.(bookmark.verseId)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  currentId === bookmark.verseId
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <Badge variant="outline" className="mb-1 text-xs">
                  {bookmark.chapter}
                </Badge>
                <p className="text-sm font-medium line-clamp-2">{bookmark.verse}</p>
                {bookmark.note && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    📌 {bookmark.note}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

/**
 * 简单的书签按钮组件
 */
export function BookmarkButton({
  isBookmarked,
  onToggle,
}: {
  isBookmarked: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      variant={isBookmarked ? 'default' : 'outline'}
      size="sm"
      onClick={onToggle}
      className={isBookmarked ? 'bg-amber-500 hover:bg-amber-600' : ''}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-4 h-4 mr-2" />
      ) : (
        <Bookmark className="w-4 h-4 mr-2" />
      )}
      {isBookmarked ? '已收藏' : '收藏'}
    </Button>
  );
}
