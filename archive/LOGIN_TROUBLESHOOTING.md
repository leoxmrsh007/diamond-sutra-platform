# 登录问题完整修复指南

## 问题1: Content Security Policy (CSP) 错误

### 错误信息
```
Content Security Policy of your site blocks the use of 'eval' in JavaScript
```

### 已修复
已在 `vercel.json` 中添加CSP头部，允许必要的JavaScript功能：
- 允许 `unsafe-eval` 和 `unsafe-inline` 以支持Next.js
- 允许Google Fonts和Analytics
- 等待Vercel部署完成（约2分钟）

### 如果问题仍然存在

#### 检查浏览器扩展
CSP错误有时由浏览器扩展引起：
1. 尝试在无痕模式（隐私模式）中访问网站
2. 禁用可疑的浏览器扩展
3. 清除浏览器缓存和Cookie

#### 手动清除浏览器数据
```
Chrome/Edge: Ctrl+Shift+Delete
Firefox: Ctrl+Shift+Delete
Safari: Cmd+Option+E
```

---

## 问题2: 登录500错误（NEXTAUTH_URL不匹配）

### 错误原因
`NEXTAUTH_URL` 环境变量设置为 `https://jinganjing.cn`，但实际访问的是 `https://www.jinganjing.cn`

### 修复步骤（必须手动操作）

#### 方法1：通过Vercel控制台（推荐）

1. **访问Vercel**: https://vercel.com/dashboard
2. **选择项目**: `diamond-sutra-platform`
3. **进入设置**: Settings → Environment Variables
4. **找到并编辑** `NEXTAUTH_URL`:
   - 当前值：`https://jinganjing.cn`
   - 改为：`https://www.jinganjing.cn`
5. **保存**并触发重新部署

#### 方法2：使用Vercel CLI

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 更新环境变量
vercel env set NEXTAUTH_URL https://www.jinganjing.cn production

# 触发重新部署
vercel --prod
```

---

## 验证修复

### 1. 检查环境变量配置

等待部署完成后，访问：
```
https://www.jinganjing.cn/api/check-config
```

应该返回：
```json
{
  "nextauth": {
    "url": "https://www.jinganjing.cn",
    "secret": "SET",
    ...
  }
}
```

### 2. 测试登录

1. **访问登录页面**: https://www.jinganjing.cn/login
2. **使用测试账号**:
   - 邮箱: `admin@example.com`
   - 密码: `Admin@123`
3. **预期结果**: 登录成功，重定向到首页

### 3. 检查浏览器控制台

按F12打开开发者工具，查看Console标签：
- 不应该有CSP错误
- 不应该有JavaScript错误
- 不应该有网络错误（404、500等）

---

## 如果登录仍然失败

### 检查列表

- [ ] NEXTAUTH_URL 是否设置为 `https://www.jinganjing.cn`
- [ ] NEXTAUTH_SECRET 是否已设置
- [ ] DATABASE_URL 是否正确
- [ ] 等待Vercel部署完成（查看部署状态）
- [ ] 清除浏览器缓存和Cookie
- [ ] 尝试在无痕模式下登录
- [ ] 检查浏览器控制台的具体错误信息

### 常见错误和解决方案

#### 错误1: "The domain in the current settings (https://jinganjing.cn) does not match the domain you are using (https://www.jinganjing.cn)."

**解决方案**: 更新NEXTAUTH_URL环境变量

#### 错误2: "Cannot read property 'session' of undefined"

**解决方案**: 等待部署完成，清除浏览器缓存

#### 错误3: "Network request failed"

**解决方案**: 检查网络连接，或尝试刷新页面

---

## 调试工具

### API端点

1. **环境变量检查**:
   ```
   GET https://www.jinganjing.cn/api/check-config
   ```

2. **环境变量状态**:
   ```
   GET https://www.jinganjing.cn/api/check-env
   ```

3. **测试登录**:
   ```bash
   curl -X POST https://www.jinganjing.cn/api/test-login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"Admin@123"}'
   ```

---

## 联系支持

如果以上方法都无法解决问题，请提供以下信息：

1. **具体错误信息**（浏览器控制台截图）
2. **部署状态**（Vercel部署链接）
3. **访问URL**（完整URL）
4. **浏览器信息**（Chrome/Firefox/Edge + 版本号）

---

## 部署时间表

| 操作 | 预计时间 |
|------|---------|
| Vercel自动部署 | 2-3分钟 |
| CDN缓存更新 | 1-2分钟 |
| 环境变量生效 | 立即 |
| 总计 | 约3-5分钟 |

---

## 完成检查清单

在测试登录前，请确认：

- [ ] Vercel部署已完成（绿色勾号）
- [ ] NEXTAUTH_URL 已更新为 `https://www.jinganjing.cn`
- [ ] 浏览器缓存已清除
- [ ] 没有浏览器扩展干扰
- [ ] 网络连接正常

完成以上检查后，登录应该可以正常工作！
