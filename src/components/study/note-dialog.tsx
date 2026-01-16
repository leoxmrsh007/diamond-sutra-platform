/**
 * 笔记对话框组件
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Tag,
  Sparkles,
} from 'lucide-react';

export interface Note {
  id: string;
  title?: string;
  content: string;
  tags: string[];
  verse: string;
  chapter: string;
  createdAt: string;
}

interface NoteDialogProps {
  verse: string;
  chapter: string;
  verseId: string;
  trigger?: React.ReactNode;
  onSave?: (note: Omit<Note, 'id' | 'createdAt'>) => void;
}

// 模拟笔记数据
const mockNotes: Note[] = [
  {
    id: '1',
    title: '无住的理解',
    content: '无住不是什么都不做，而是做的时候不执着于结果。就像吃饭时专心吃饭，工作时候专心工作。',
    tags: ['无住', '日常修行'],
    verse: '应无所住而生其心',
    chapter: '第十分',
    createdAt: '2024-01-18',
  },
  {
    id: '2',
    title: '布施的意义',
    content: '布施不是单纯的给予，而是放下对财物的执着。三轮体空——没有施者、受者、所施之物。',
    tags: ['布施', '三轮体空'],
    verse: '菩萨于法，应无所住行于布施',
    chapter: '第四分',
    createdAt: '2024-01-15',
  },
];

type ApiNoteResponse = {
  id: string;
  title?: string | null;
  content: string;
  createdAt: string | Date;
  tags?: string[] | null;
};

const isApiNoteResponse = (value: unknown): value is ApiNoteResponse => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.id !== 'string' || typeof candidate.content !== 'string') {
    return false;
  }
  const createdAt = candidate.createdAt;
  return typeof createdAt === 'string' || createdAt instanceof Date;
};

const toNote = (apiNote: ApiNoteResponse, verse: string, chapter: string): Note => ({
  id: apiNote.id,
  title: apiNote.title ?? undefined,
  content: apiNote.content,
  tags: Array.isArray(apiNote.tags)
    ? apiNote.tags.filter((tag): tag is string => typeof tag === 'string')
    : [],
  verse,
  chapter,
  createdAt: new Date(apiNote.createdAt).toISOString().split('T')[0],
});

type EditableNote = {
  title: string;
  content: string;
  tags: string[];
};

export function NoteDialog({ verse, chapter, verseId, trigger, onSave }: NoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState<EditableNote>({
    title: '',
    content: '',
    tags: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [tagInput, setTagInput] = useState('');

  // 加载笔记（优先 API，失败回退模拟）
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/notes?verseId=${encodeURIComponent(verseId)}`);
        if (res.ok) {
          const data: unknown = await res.json();
          if (Array.isArray(data)) {
            const mapped = data.filter(isApiNoteResponse).map((item) => toNote(item, verse, chapter));
            setNotes(mapped);
            return;
          }
        }
      } catch {}
      const verseNotes = mockNotes.filter((n) => n.verse === verse);
      setNotes(verseNotes);
    })();
  }, [verse, verseId, chapter]);

  const handleSave = () => {
    if (!currentNote.content.trim()) return;

    const newNote: Omit<Note, 'id' | 'createdAt'> = {
      title: currentNote.title || undefined,
      content: currentNote.content,
      tags: currentNote.tags,
      verse,
      chapter,
    };

    if (onSave) {
      onSave(newNote);
    }

    // 优先保存到 API：编辑走 PUT，新增走 POST；失败回退本地
    (async () => {
      try {
        if (currentEditId) {
          const res = await fetch(`/api/notes/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newNote.content, title: newNote.title }),
          });
          if (!res.ok) throw new Error('failed');
          const saved = (await res.json()) as ApiNoteResponse;
          const normalized = toNote(saved, verse, chapter);
          setNotes((prev) =>
            prev.map((n) => (n.id === currentEditId ? { ...n, title: normalized.title, content: normalized.content } : n))
          );
        } else {
          const res = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ verseId, content: newNote.content, title: newNote.title }),
          });
          if (!res.ok) throw new Error('failed');
          const saved = (await res.json()) as ApiNoteResponse;
          const normalized = toNote(saved, verse, chapter);
          setNotes((prev) => [...prev, normalized]);
        }
      } catch {
        if (currentEditId) {
          setNotes((prev) =>
            prev.map((n) =>
              n.id === currentEditId ? { ...n, content: newNote.content, title: newNote.title || undefined } : n
            )
          );
        } else {
          const noteWithId: Note = {
            ...newNote,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split('T')[0],
          };
          setNotes((prev) => [...prev, noteWithId]);
        }
      }
    })();

    // 重置表单
    setCurrentNote({ title: '', content: '', tags: [] });
    setIsEditing(false);
    setCurrentEditId(null);
  };

  const handleDelete = (id: string) => {
    (async () => {
      try {
        const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('failed');
      } catch {}
      setNotes(notes.filter((n) => n.id !== id));
    })();
  };

  const handleEdit = (note: Note) => {
    setCurrentNote({
      title: note.title || '',
      content: note.content,
      tags: note.tags,
    });
    setIsEditing(true);
    setCurrentEditId(note.id);
  };

  const addTag = () => {
    if (tagInput.trim() && !currentNote.tags.includes(tagInput.trim())) {
      setCurrentNote({
        ...currentNote,
        tags: [...currentNote.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setCurrentNote({
      ...currentNote,
      tags: currentNote.tags.filter((t) => t !== tag),
    });
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            添加笔记
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            我的笔记
          </DialogTitle>
          <DialogDescription>
            {chapter} · {verse.slice(0, 20)}...
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-[60vh]">
          {/* Search */}
          {!isEditing && (
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索笔记..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={() => setIsEditing(true)} className="bg-amber-500 hover:bg-amber-600">
                <Plus className="w-4 h-4 mr-2" />
                新建笔记
              </Button>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing ? (
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div>
                <label className="text-sm font-medium mb-1 block">标题（可选）</label>
                <Input
                  placeholder="给笔记起个标题..."
                  value={currentNote.title}
                  onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                />
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">笔记内容</label>
                <Textarea
                  placeholder="写下您的学习心得..."
                  value={currentNote.content}
                  onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                  className="min-h-[200px] resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">标签</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="添加标签..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Tag className="w-4 h-4" />
                  </Button>
                </div>
                {currentNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentNote.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleSave} disabled={!currentNote.content.trim()} className="flex-1 bg-amber-500 hover:bg-amber-600">
                  保存笔记
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  取消
                </Button>
              </div>
            </div>
          ) : (
            /* Notes List */
            <ScrollArea className="flex-1">
              <div className="space-y-3 pr-4">
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{searchQuery ? '没有找到相关笔记' : '还没有笔记，开始记录您的学习心得吧'}</p>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <div key={note.id} className="p-4 rounded-lg border hover:bg-muted transition-colors">
                      {note.title && <h4 className="font-medium mb-2">{note.title}</h4>}
                      <p className="text-sm text-muted-foreground mb-3">{note.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(note)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(note.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{note.createdAt}</p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 笔记侧边栏组件 - 用于学习页面
 */
export function NoteSidebar({
  verse,
  chapter,
  notes,
  onAddNote,
}: {
  verse: string;
  chapter: string;
  notes: Note[];
  onAddNote?: (note: Omit<Note, 'id' | 'createdAt'>) => void;
}) {
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    if (onAddNote) {
      onAddNote({
        content: newNote,
        tags: [],
        verse,
        chapter,
      });
      setNewNote('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border bg-amber-50">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          快速笔记
        </h3>
        <Textarea
          placeholder="记录您的心得..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={4}
          className="mb-2"
        />
        <Button
          size="sm"
          onClick={handleAddNote}
          disabled={!newNote.trim()}
          className="w-full bg-amber-500 hover:bg-amber-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          添加笔记
        </Button>
      </div>

      {notes.length > 0 && (
        <div className="p-4 rounded-lg border">
          <h3 className="font-medium mb-3">相关笔记</h3>
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="p-3 rounded bg-muted text-sm">
                <p className="line-clamp-2">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{note.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
