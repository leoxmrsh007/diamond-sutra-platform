/**
 * 每日签到组件
 */

'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Flame,
  Calendar,
  CheckCircle2,
  Trophy,
  Sparkles,
} from 'lucide-react';

interface CheckInRecord {
  date: string;
  checked: boolean;
  streakDay?: number;
}

interface DailyCheckInProps {
  onCheckIn?: (streak: number) => void;
}

export function DailyCheckIn({ onCheckIn }: DailyCheckInProps) {
  const [todayChecked, setTodayChecked] = useState(false);
  const [consecutiveDays, setConsecutiveDays] = useState(7);
  const [totalDays, setTotalDays] = useState(45);
  const weekRecords = useMemo<CheckInRecord[]>(() => {
    const records: CheckInRecord[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const isToday = i === 0;
      const isPast = i > 0;

      records.push({
        date: date.toISOString().split('T')[0],
        checked: isPast || (isToday && todayChecked),
        streakDay: isPast ? consecutiveDays - (6 - i) : undefined,
      });
    }

    return records;
  }, [todayChecked, consecutiveDays]);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleCheckIn = () => {
    if (todayChecked) return;

    setTodayChecked(true);
    setShowAnimation(true);

    // 更新连续天数
    const newStreak = consecutiveDays + 1;
    setConsecutiveDays(newStreak);
    setTotalDays(totalDays + 1);

    if (onCheckIn) {
      onCheckIn(newStreak);
    }

    // 动画结束后隐藏
    setTimeout(() => setShowAnimation(false), 2000);
  };

  const getWeekdayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  };

  const getDayNumber = (dateStr: string) => {
    return dateStr.split('-')[2];
  };

  const getStreakReward = (streak: number) => {
    if (streak >= 100) return { icon: '🏆', title: '百日精进', desc: '连续签到100天' };
    if (streak >= 30) return { icon: '💫', title: '月满功德', desc: '连续签到30天' };
    if (streak >= 21) return { icon: '🪷', title: '莲花开敷', desc: '连续签到21天' };
    if (streak >= 14) return { icon: '🌟', title: '两周精进', desc: '连续签到14天' };
    if (streak >= 7) return { icon: '🔥', title: '一周坚持', desc: '连续签到7天' };
    if (streak >= 3) return { icon: '🌱', title: '初发心', desc: '连续签到3天' };
    return null;
  };

  const reward = getStreakReward(consecutiveDays);

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 overflow-hidden relative">
      {showAnimation && (
        <div className="absolute inset-0 bg-amber-400/20 flex items-center justify-center z-10 animate-in fade-in duration-500">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🙏</div>
            <p className="text-xl font-bold text-amber-900">签到成功！</p>
            <p className="text-amber-700">继续坚持，功德无量</p>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          每日签到
        </CardTitle>
        <CardDescription>
          精进修行，每日一签，培养持续学习的习惯
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 周签到日历 */}
        <div className="flex justify-between gap-1">
          {weekRecords.map((record, index) => {
            const isToday = index === 6;

            return (
              <div
                key={record.date}
                className={`flex flex-col items-center p-2 rounded-lg min-w-[50px] transition-all ${
                  record.checked
                    ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-white shadow-md'
                    : isToday
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                    : 'bg-white/50 text-gray-400'
                }`}
              >
                <span className="text-xs mb-1">{getWeekdayName(record.date)}</span>
                <span className="text-lg font-bold">{getDayNumber(record.date)}</span>
                {record.checked && (
                  <CheckCircle2 className="w-4 h-4 mt-1" />
                )}
                {isToday && !record.checked && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* 签到按钮 */}
        <Button
          onClick={handleCheckIn}
          disabled={todayChecked}
          className={`w-full ${
            todayChecked
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
          }`}
          size="lg"
        >
          {todayChecked ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              今日已签到
            </>
          ) : (
            <>
              <Flame className="w-5 h-5 mr-2" />
              立即签到
            </>
          )}
        </Button>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-amber-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-600">
              <Flame className="w-4 h-4" />
              <span className="text-xl font-bold">{consecutiveDays}</span>
            </div>
            <p className="text-xs text-muted-foreground">连续天数</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <Calendar className="w-4 h-4" />
              <span className="text-xl font-bold">{totalDays}</span>
            </div>
            <p className="text-xs text-muted-foreground">累计天数</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-600">
              <Trophy className="w-4 h-4" />
              <span className="text-xl font-bold">
                {Math.floor(consecutiveDays / 7)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">完成周数</p>
          </div>
        </div>

        {/* 奖励预览 */}
        {reward && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-amber-200">
            <div className="text-3xl">{reward.icon}</div>
            <div className="flex-1">
              <p className="font-medium text-amber-900">{reward.title}</p>
              <p className="text-xs text-amber-700">{reward.desc}</p>
            </div>
            {todayChecked && (
              <Badge className="bg-green-500">已达成</Badge>
            )}
          </div>
        )}

        {/* 下一阶段奖励 */}
        {!reward && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-amber-200 opacity-70">
            <div className="text-3xl">🌱</div>
            <div className="flex-1">
              <p className="font-medium text-amber-900">初发心</p>
              <p className="text-xs text-amber-700">连续签到3天解锁</p>
            </div>
            <div className="text-sm text-muted-foreground">
              再签 {3 - consecutiveDays} 天
            </div>
          </div>
        )}

        {/* 签到名言 */}
        <div className="text-center p-3 rounded-lg bg-white/30">
          <p className="text-sm text-amber-800 italic flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            {todayChecked
              ? '"精进修习者，如水滴穿石，日久功深。"'
              : '"日日行善，功德无量；日日精进，智慧日增。"'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 签到日历组件 - 展示完整月份
 */
export function CheckInCalendar({ year, month }: { year?: number; month?: number }) {
  const today = new Date();
  const currentYear = year || today.getFullYear();
  const currentMonth = month || today.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const [checkedDays] = useState<number[]>(() => {
    // 模拟已签到日期
    return Array.from({ length: today.getDate() }, (_, i) => i + 1).filter(() => Math.random() > 0.3);
  });

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {currentYear}年 {monthNames[currentMonth]}
          </span>
          <Badge variant="outline">
            已签到 {checkedDays.length} 天
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 星期标题 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* 日期网格 */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isChecked = checkedDays.includes(day);
            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <div
                key={day}
                className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-all ${
                  isChecked
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm'
                    : isToday
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                    : 'hover:bg-muted'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* 图例 */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-amber-400 to-orange-500" />
            <span>已签到</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-100 border-2 border-amber-300" />
            <span>今天</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted" />
            <span>未签到</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
