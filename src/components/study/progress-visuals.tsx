/**
 * 学习进度可视化组件
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Target, Trophy, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudyStatsProps {
  studiedDays?: number;
  consecutiveDays?: number;
  studiedVerses?: number;
  totalVerses?: number;
  notes?: number;
  bookmarks?: number;
  level?: string;
  exp?: number;
  nextLevelExp?: number;
}

/**
 * 学习统计卡片
 */
export function StudyStatsCard({
  studiedDays = 45,
  consecutiveDays = 7,
  studiedVerses = 128,
  totalVerses = 500,
  notes = 23,
  bookmarks = 15,
  level = '修行中',
  exp = 1250,
  nextLevelExp = 2000,
}: StudyStatsProps) {
  const progress = (studiedVerses / totalVerses) * 100;
  const levelProgress = (exp / nextLevelExp) * 100;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Flame className="w-5 h-5 text-orange-500" />}
        label="连续签到"
        value={consecutiveDays}
        unit="天"
        color="orange"
      />
      <StatCard
        icon={<Calendar className="w-5 h-5 text-blue-500" />}
        label="累计学习"
        value={studiedDays}
        unit="天"
        color="blue"
      />
      <StatCard
        icon={<Target className="w-5 h-5 text-green-500" />}
        label="已学偈颂"
        value={studiedVerses}
        unit="偈"
        color="green"
      />
      <StatCard
        icon={<Trophy className="w-5 h-5 text-amber-500" />}
        label="修行等级"
        value={level}
        unit=""
        color="amber"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  unit: string;
  color: 'orange' | 'blue' | 'green' | 'amber' | 'purple' | 'red';
}

function StatCard({ icon, label, value, unit, color }: StatCardProps) {
  const colorClasses = {
    orange: 'bg-orange-50 border-orange-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200',
    purple: 'bg-purple-50 border-purple-200',
    red: 'bg-red-50 border-red-200',
  };

  return (
    <Card className={colorClasses[color]}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white">{icon}</div>
          <div>
            <p className="text-xl font-bold">
              {typeof value === 'number' ? value : value}
              <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
            </p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 学习进度环
 */
export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted opacity-20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-amber-500"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * 学习进度条
 */
export function StudyProgressBar({
  current,
  total,
  label,
  showPercentage = true,
}: {
  current: number;
  total: number;
  label: string;
  showPercentage?: boolean;
}) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{showPercentage ? `${percentage}%` : `${current}/${total}`}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

/**
 * 章节学习状态卡片
 */
export function ChapterProgressCard({
  chapterNum,
  title,
  status,
  versesLearned,
  totalVerses,
}: {
  chapterNum: number;
  title: string;
  status: 'completed' | 'learning' | 'not-started';
  versesLearned: number;
  totalVerses: number;
}) {
  const statusConfig = {
    completed: { label: '已完成', color: 'bg-green-100 text-green-700', icon: '✓' },
    learning: { label: '学习中', color: 'bg-blue-100 text-blue-700', icon: '◐' },
    'not-started': { label: '未开始', color: 'bg-gray-100 text-gray-700', icon: '○' },
  };

  const config = statusConfig[status];
  const progress = Math.round((versesLearned / totalVerses) * 100);

  return (
    <Card className={cn("hover:shadow-md transition-shadow", status === 'completed' && 'border-green-200')}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold", config.color)}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">第{chapterNum}分</span>
              <Badge variant="outline" className={cn("text-xs", config.color)}>
                {config.label}
              </Badge>
            </div>
            <h4 className="font-medium text-sm mb-2 truncate">{title}</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", status === 'completed' ? 'bg-green-500' : 'bg-amber-500')}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 学习热力图组件
 */
export function StudyHeatmap({
  data,
}: {
  data: (number | null)[]; // 每天的学习时长（分钟），null 表示未学习
}) {
  const weeks = Math.ceil(data.length / 7);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">学习热力图</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const index = weekIndex * 7 + dayIndex;
                const value = data[index];

                if (value === null || value === undefined) {
                  return (
                    <div
                      key={dayIndex}
                      className="w-3 h-3 rounded-sm bg-muted"
                    />
                  );
                }

                const intensity = Math.min(value / 60, 1); // 假设60分钟为最深色
                const colorClass = intensity === 0
                  ? 'bg-amber-100'
                  : intensity < 0.25
                  ? 'bg-amber-200'
                  : intensity < 0.5
                  ? 'bg-amber-400'
                  : intensity < 0.75
                  ? 'bg-amber-600'
                  : 'bg-amber-800';

                return (
                  <div
                    key={dayIndex}
                    className={cn("w-3 h-3 rounded-sm", colorClass)}
                    title={`${value}分钟`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-1 mt-3 text-xs text-muted-foreground">
          <span>少</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-amber-100" />
            <div className="w-3 h-3 rounded-sm bg-amber-200" />
            <div className="w-3 h-3 rounded-sm bg-amber-400" />
            <div className="w-3 h-3 rounded-sm bg-amber-600" />
            <div className="w-3 h-3 rounded-sm bg-amber-800" />
          </div>
          <span>多</span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 等级进度卡片
 */
export function LevelProgressCard({
  currentLevel,
  nextLevel,
  currentExp,
  maxExp,
}: {
  currentLevel: string;
  nextLevel: string;
  currentExp: number;
  maxExp: number;
}) {
  const progress = (currentExp / maxExp) * 100;
  const remaining = maxExp - currentExp;

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-amber-700">当前等级</p>
            <p className="text-2xl font-bold text-amber-900">{currentLevel}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-amber-700">下一等级</p>
            <p className="text-lg font-semibold text-amber-800">{nextLevel}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-amber-800">
            <span>经验值进度</span>
            <span>{currentExp} / {maxExp}</span>
          </div>
          <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-amber-700 text-center">
            还需要 {remaining} 经验值升级
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 学习时长统计图（简单条形图）
 */
export function StudyTimeChart({
  data,
}: {
  data: { label: string; hours: number }[];
}) {
  const maxHours = Math.max(...data.map((d) => d.hours));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">本周学习时长</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => {
            const height = (item.hours / maxHours) * 100;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs w-8 text-muted-foreground">{item.label}</span>
                <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                    style={{ width: `${height}%` }}
                  />
                </div>
                <span className="text-xs w-12 text-right">{item.hours}h</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
