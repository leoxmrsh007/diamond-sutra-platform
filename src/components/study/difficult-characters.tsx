/**
 * 难点字注组件
 * Difficult Characters Annotation Component
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DifficultCharacter {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
  context?: string;
  frequency?: number;
}

interface DifficultCharacterAnnotationProps {
  text: string;
  scripture: string;
  onCharacterHover?: (char: DifficultCharacter) => void;
}

export function DifficultCharacterAnnotation({
  text,
  scripture,
  onCharacterHover,
}: DifficultCharacterAnnotationProps) {
  const [characters, setCharacters] = useState<Map<string, DifficultCharacter>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredChar, setHoveredChar] = useState<DifficultCharacter | null>(null);

  useEffect(() => {
    async function loadCharacters() {
      try {
        const response = await fetch(`/api/difficult-characters?scripture=${scripture}`);
        const data = await response.json();

        if (data.characters) {
          const charMap = new Map<string, DifficultCharacter>();
          data.characters.forEach((char: DifficultCharacter) => {
            charMap.set(char.character, char);
          });
          setCharacters(charMap);
        }
      } catch (error) {
        console.error('加载难点字失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCharacters();
  }, [scripture]);

  const handleMouseEnter = (char: DifficultCharacter, event: React.MouseEvent) => {
    setHoveredChar(char);

    // 计算tooltip位置
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const tooltip = document.getElementById(`tooltip-${char.id}`);

    if (tooltip) {
      tooltip.style.top = `${rect.bottom + 8}px`;
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    }

    onCharacterHover?.(char);
  };

  const handleMouseLeave = () => {
    setHoveredChar(null);
  };

  const annotatedText = text.split('').map((char, index) => {
    const charData = characters.get(char);

    if (charData) {
      return (
        <span
          key={`${char}-${index}`}
          className="difficult-char"
          data-char-id={charData.id}
          onMouseEnter={(e) => handleMouseEnter(charData, e)}
          onMouseLeave={handleMouseLeave}
        >
          {char}
        </span>
      );
    }

    return char;
  });

  return (
    <div className="difficult-characters-wrapper">
      {annotatedText}

      <style jsx>{`
        .difficult-char {
          border-bottom: 1px dashed var(--accent-color, #b8860b);
          cursor: help;
          position: relative;
          display: inline-block;
          padding: 0 2px;
          transition: all 0.2s ease;
        }

        .difficult-char:hover {
          border-bottom-style: solid;
          background-color: rgba(184, 134, 11, 0.1);
        }

        .tooltip {
          position: absolute;
          background-color: rgba(0, 0, 0, 0.9);
          color: #fff;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 9999;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          pointer-events: none;
        }

        .tooltip-pinyin {
          font-weight: 600;
          margin-bottom: 2px;
        }

        .tooltip-meaning {
          line-height: 1.4;
        }

        .tooltip-context {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 4px;
          padding-top: 4px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {hoveredChar && (
        <div id={`tooltip-${hoveredChar.id}`} className="tooltip">
          <div className="tooltip-pinyin">{hoveredChar.character}</div>
          <div className="tooltip-pinyin">{hoveredChar.pinyin}</div>
          <div className="tooltip-meaning">{hoveredChar.meaning}</div>
          {hoveredChar.context && (
            <div className="tooltip-context">{hoveredChar.context}</div>
          )}
          {hoveredChar.frequency && (
            <div className="tooltip-context">出现频率：{hoveredChar.frequency}次</div>
          )}
        </div>
      )}
    </div>
  );
}

export function DifficultCharactersCard({ chapterId, verseId }: { chapterId?: string; verseId?: string }) {
  const [characters, setCharacters] = useState<DifficultCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCharacters() {
      try {
        const params = new URLSearchParams();
        if (chapterId) params.append('chapterId', chapterId);
        if (verseId) params.append('verseId', verseId);

        const response = await fetch(`/api/difficult-characters?${params.toString()}`);
        const data = await response.json();
        setCharacters(data.characters || []);
      } catch (error) {
        console.error('加载难点字失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (chapterId || verseId) {
      loadCharacters();
    }
  }, [chapterId, verseId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📝 难点字注</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (characters.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📝 难点字注</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            暂无难点字数据
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📝 难点字注</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {characters.map((char) => (
            <div key={char.id} className="p-3 border rounded hover:bg-amber-50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-bold text-amber-700 mb-1">
                    {char.character}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {char.pinyin}
                  </div>
                  <div className="text-sm">
                    {char.meaning}
                  </div>
                </div>
                {char.frequency && (
                  <Badge variant="secondary" className="ml-2">
                    {char.frequency}次
                  </Badge>
                )}
              </div>
              {char.context && (
                <p className="text-xs text-muted-foreground mt-2">
                  {char.context}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
