/**
 * 用户设置页面
 */

'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Bell,
  Lock,
  Eye,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Trash2,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">设置</h1>
          <p className="text-muted-foreground">
            管理您的账户设置和偏好
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              个人资料
            </TabsTrigger>
            <TabsTrigger value="account">
              <Lock className="w-4 h-4 mr-2" />
              账户安全
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Palette className="w-4 h-4 mr-2" />
              偏好设置
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              通知设置
            </TabsTrigger>
          </TabsList>

          {/* 个人资料 */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>
                  更新您的个人资料信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">法名 / 昵称</label>
                    <Input defaultValue="慧明" placeholder="请输入法名或昵称" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">邮箱</label>
                    <Input type="email" defaultValue="huiming@example.com" placeholder="请输入邮箱" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">个人简介</label>
                  <Input
                    defaultValue="精进修行中，愿与各位师兄共同学习《金刚经》智慧"
                    placeholder="介绍一下自己"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">所在地区</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input className="pl-9" defaultValue="北京市" placeholder="请输入所在地区" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">联系电话</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input className="pl-9" placeholder="请输入联系电话" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    修行信息
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">修行年限</label>
                      <select className="w-full px-3 py-2 rounded-md border bg-background">
                        <option>初学（1年以下）</option>
                        <option>入门（1-3年）</option>
                        <option selected>精进（3-5年）</option>
                        <option>深入（5-10年）</option>
                        <option>资深（10年以上）</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">修学重点</label>
                      <select className="w-full px-3 py-2 rounded-md border bg-background">
                        <option selected>般若经典</option>
                        <option>禅宗修持</option>
                        <option>净土念佛</option>
                        <option>密法实修</option>
                        <option>综合学习</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600">
                    {saveSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        已保存
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        保存更改
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 账户安全 */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>修改密码</CardTitle>
                <CardDescription>
                  定期更改密码有助于保护账户安全
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">当前密码</label>
                  <Input type="password" placeholder="请输入当前密码" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">新密码</label>
                  <Input type="password" placeholder="请输入新密码" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">确认新密码</label>
                  <Input type="password" placeholder="请再次输入新密码" />
                </div>
                <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600">
                  更新密码
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>绑定账号</CardTitle>
                <CardDescription>
                  绑定第三方账号以便快速登录
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">Google</p>
                      <p className="text-sm text-muted-foreground">未绑定</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    绑定
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">危险区域</CardTitle>
                <CardDescription>
                  以下操作不可逆，请谨慎操作
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">删除账户</p>
                    <p className="text-sm text-muted-foreground">
                      删除账户后，所有数据将永久删除，无法恢复
                    </p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除账户
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 偏好设置 */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>界面设置</CardTitle>
                <CardDescription>
                  自定义您的界面体验
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">深色模式</p>
                    <p className="text-sm text-muted-foreground">
                      切换界面外观为深色主题
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    切换
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">字体大小</p>
                    <p className="text-sm text-muted-foreground">
                      调整界面文字大小
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {['小', '中', '大'].map((size) => (
                      <Button
                        key={size}
                        variant={size === '中' ? 'default' : 'outline'}
                        size="sm"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="font-medium mb-3">主题颜色</p>
                  <div className="flex gap-3">
                    {[
                      { name: '琥珀金', color: 'bg-amber-500', border: 'border-amber-500' },
                      { name: '禅意绿', color: 'bg-green-500', border: 'border-green-500' },
                      { name: '智慧蓝', color: 'bg-blue-500', border: 'border-blue-500' },
                      { name: '清净紫', color: 'bg-purple-500', border: 'border-purple-500' },
                    ].map((theme) => (
                      <button
                        key={theme.name}
                        className={`w-12 h-12 rounded-lg ${theme.color} border-2 ${
                          theme.name === '琥珀金' ? 'ring-2 ring-offset-2 ' + theme.border : 'border-transparent'
                        }`}
                        title={theme.name}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>语言设置</CardTitle>
                <CardDescription>
                  选择您偏好的语言
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <select className="flex-1 px-3 py-2 rounded-md border bg-background">
                    <option selected>简体中文</option>
                    <option>繁體中文</option>
                    <option>English</option>
                    <option>日本語</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 通知设置 */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>通知偏好</CardTitle>
                <CardDescription>
                  选择您希望接收的通知类型
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: '课程更新', desc: '当您报名的课程有新内容时通知您' },
                  { title: '社区互动', desc: '当有人回复您的帖子或评论时通知您' },
                  { title: '每日提醒', desc: '每天定时提醒您进行经文学习' },
                  { title: '签到提醒', desc: '提醒您完成每日签到' },
                  { title: 'AI回复', desc: '当AI讲师回复您的问题时通知您' },
                  { title: '活动公告', desc: '接收平台活动和重要公告通知' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <div className="w-12 h-6 bg-amber-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>通知方式</CardTitle>
                <CardDescription>
                  选择接收通知的方式
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">站内通知</p>
                      <p className="text-sm text-muted-foreground">在平台内显示通知</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    已启用
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">邮件通知</p>
                      <p className="text-sm text-muted-foreground">发送到您的邮箱</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    启用
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
