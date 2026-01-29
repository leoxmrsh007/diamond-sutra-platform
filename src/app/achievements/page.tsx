'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Star, Target, Users, Flame, Heart, BookOpen } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    fetchAchievements();
    fetchUserAchievements();
    fetchLeaderboard();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      const data = await response.json();
      if (data.success) {
        setAchievements(data.achievements);
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAchievements = async () => {
    try {
      const response = await fetch('/api/achievements/user');
      const data = await response.json();
      if (data.success) {
        setUserAchievements(data.userAchievements);
      }
    } catch (error) {
      console.error('Failed to fetch user achievements:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/achievements/leaderboard');
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  const categories = ['ALL', 'STUDY', 'SOCIAL', 'CHECKIN', 'MILESTONE', 'SPECIAL'];

  const filteredAchievements = selectedCategory === 'ALL'
    ? achievements
    : achievements.filter((a) => a.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'STUDY':
        return <BookOpen className="h-5 w-5" />;
      case 'SOCIAL':
        return <Users className="h-5 w-5" />;
      case 'CHECKIN':
        return <Flame className="h-5 w-5" />;
      case 'MILESTONE':
        return <Target className="h-5 w-5" />;
      case 'SPECIAL':
        return <Star className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'STUDY':
        return 'bg-blue-500';
      case 'SOCIAL':
        return 'bg-green-500';
      case 'CHECKIN':
        return 'bg-orange-500';
      case 'MILESTONE':
        return 'bg-purple-500';
      case 'SPECIAL':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some((ua) => ua.achievementId === achievementId);
  };

  const unlockedCount = userAchievements.length;
  const totalProgress = achievements.length > 0
    ? Math.round((unlockedCount / achievements.length) * 100)
    : 0;

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Achievements</h1>
        <p className="text-muted-foreground">
          Unlock achievements by studying, checking in, and engaging with the community
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unlockedCount}</div>
            <p className="text-xs text-muted-foreground">
              of {achievements.length} achievements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProgress}%</div>
            <p className="text-xs text-muted-foreground">
              completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              #{leaderboard.findIndex((u) => u.id === 'current-user') + 1 || '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              on leaderboard
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Achievements</CardTitle>
              <CardDescription>
                View all available achievements and your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {loading ? (
                <p className="text-center text-muted-foreground py-8">
                  Loading achievements...
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      unlocked={isUnlocked(achievement.id)}
                      getCategoryIcon={getCategoryIcon}
                      getCategoryColor={getCategoryColor}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievement Leaderboard</CardTitle>
              <CardDescription>
                Top users by achievements unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-muted-foreground py-8">
                  Loading leaderboard...
                </p>
              ) : (
                <div className="space-y-2">
                  {leaderboard.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No leaderboard data yet
                    </p>
                  ) : (
                    leaderboard.map((user, index) => (
                      <LeaderboardItem key={user.id} user={user} rank={index + 1} />
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AchievementCard({
  achievement,
  unlocked,
  getCategoryIcon,
  getCategoryColor,
}: any) {
  return (
    <div
      className={`p-4 border rounded-lg transition-all ${
        unlocked ? 'bg-primary/5 border-primary/20' : 'opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className={`p-2 rounded-lg text-white ${getCategoryColor(
            achievement.category
          )}`}
        >
          {getCategoryIcon(achievement.category)}
        </div>
        {unlocked && (
          <Badge variant="default" className="ml-auto">
            <Award className="h-3 w-3 mr-1" />
            Unlocked
          </Badge>
        )}
      </div>

      <h3 className="font-semibold mb-1">{achievement.title}</h3>
      <p className="text-sm text-muted-foreground mb-2">
        {achievement.description}
      </p>

      <div className="flex items-center justify-between text-xs">
        <Badge variant="outline" className="text-xs">
          {achievement.category}
        </Badge>
        <span className="text-muted-foreground">
          +{achievement.experience} XP
        </span>
      </div>
    </div>
  );
}

function LeaderboardItem({ user, rank }: any) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-orange-400" />;
      default:
        return <span className="font-medium text-sm w-6">{rank}.</span>;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8">
          {getRankIcon(rank)}
        </div>
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || 'User'}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <div>
          <p className="font-medium text-sm">{user.name || 'Anonymous'}</p>
          <p className="text-xs text-muted-foreground">
            {user._count.userAchievements} achievements
          </p>
        </div>
      </div>
      <div className="text-right text-sm">
        <p className="font-medium">Lv.{user.level}</p>
        <p className="text-xs text-muted-foreground">{user.experience} XP</p>
      </div>
    </div>
  );
}
