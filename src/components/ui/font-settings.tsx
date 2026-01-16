/**
 * 字体设置组件
 * 用于阅读模式和学习页面
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FontFamily = 'system' | 'serif' | 'sans' | 'mono';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type LineHeightOption = 'tight' | 'normal' | 'relaxed';

const fontFamilies = {
  system: { name: '系统默认', className: 'font-sans' },
  serif: { name: '宋体/明体', className: 'font-serif' },
  sans: { name: '黑体', className: 'font-sans' },
  mono: { name: '等宽', className: 'font-mono' },
};

const fontSizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

interface FontSettingsProps {
  fontFamily?: FontFamily;
  fontSize?: FontSize;
  lineHeight?: LineHeightOption;
  onChange?: (settings: { fontFamily: FontFamily; fontSize: FontSize; lineHeight: LineHeightOption }) => void;
}

export function FontSettings({
  fontFamily: defaultFont = 'system',
  fontSize: defaultSize = 'md',
  lineHeight = 'normal',
  onChange,
}: FontSettingsProps) {
  const [currentFont, setCurrentFont] = useState<FontFamily>(defaultFont);
  const [currentSize, setCurrentSize] = useState<FontSize>(defaultSize);
  const [currentLineHeight, setCurrentLineHeight] = useState<LineHeightOption>(lineHeight);

  const sizes: FontSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const sizeIndex = sizes.indexOf(currentSize);

  const handleFontChange = (font: FontFamily) => {
    setCurrentFont(font);
    onChange?.({ fontFamily: font, fontSize: currentSize, lineHeight: currentLineHeight });
  };

  const handleSizeChange = (delta: number) => {
    const newIndex = Math.max(0, Math.min(sizes.length - 1, sizeIndex + delta));
    const newSize = sizes[newIndex];
    setCurrentSize(newSize);
    onChange?.({ fontFamily: currentFont, fontSize: newSize, lineHeight: currentLineHeight });
  };

  const handleLineHeightChange = () => {
    const heights: LineHeightOption[] = ['tight', 'normal', 'relaxed'];
    const currentIndex = heights.indexOf(currentLineHeight);
    const newHeight = heights[(currentIndex + 1) % heights.length];
    setCurrentLineHeight(newHeight);
    onChange?.({ fontFamily: currentFont, fontSize: currentSize, lineHeight: newHeight });
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Font Family */}
        <div>
          <p className="text-sm font-medium mb-2">字体</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(fontFamilies) as FontFamily[]).map((font) => (
              <button
                key={font}
                onClick={() => handleFontChange(font)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                  currentFont === font
                    ? 'bg-foreground text-background'
                    : 'border-current opacity-60 hover:opacity-100'
                )}
              >
                {fontFamilies[font].name}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <p className="text-sm font-medium mb-2">字号</p>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => handleSizeChange(-1)}
              disabled={sizeIndex === 0}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <div className="flex-1 text-center">
              <span className={cn(fontSizeMap[currentSize])}>
                Aa
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                {currentSize}
              </span>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => handleSizeChange(1)}
              disabled={sizeIndex === sizes.length - 1}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Line Height */}
        <div>
          <p className="text-sm font-medium mb-2">行距</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLineHeightChange}
            className="justify-start"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {currentLineHeight === 'tight' ? '紧凑' : currentLineHeight === 'normal' ? '正常' : '宽松'}
          </Button>
        </div>

        {/* Reset */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => {
            setCurrentFont('system');
            setCurrentSize('md');
            setCurrentLineHeight('normal');
            onChange?.({ fontFamily: 'system', fontSize: 'md', lineHeight: 'normal' });
          }}
        >
          重置为默认
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * 简化的字体大小控制器（用于阅读工具栏）
 */
export function FontSizeControl({
  size,
  onChange,
}: {
  size: FontSize;
  onChange: (size: FontSize) => void;
}) {
  const sizes: FontSize[] = ['sm', 'md', 'lg', 'xl'];
  const sizeLabels = { sm: '小', md: '中', lg: '大', xl: '特大' };

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {sizes.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={cn(
            'w-8 h-8 rounded-md text-xs flex items-center justify-center transition-colors',
            size === s ? 'bg-background shadow-sm' : 'hover:bg-background/50'
          )}
        >
          {sizeLabels[s as keyof typeof sizeLabels]}
        </button>
      ))}
    </div>
  );
}

/**
 * 字体样式选择器（用于内容显示）
 */
export function FontContent({
  children,
  fontFamily,
  fontSize,
  lineHeight,
}: {
  children: React.ReactNode;
  fontFamily?: FontFamily;
  fontSize?: FontSize;
  lineHeight?: LineHeightOption;
}) {
  const fontFamilyClass = fontFamily ? fontFamilies[fontFamily].className : '';
  const fontSizeClass = fontSize ? fontSizeMap[fontSize] : 'text-base';
  const lineHeightClass = lineHeight === 'tight' ? 'leading-tight' : lineHeight === 'relaxed' ? 'leading-relaxed' : 'leading-normal';

  return (
    <div className={cn(fontFamilyClass, fontSizeClass, lineHeightClass)}>
      {children}
    </div>
  );
}
