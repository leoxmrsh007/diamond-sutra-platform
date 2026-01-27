# AI API 配置指南

## Gemini API（推荐）

### 获取 API 密钥

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 登录 Google 账号
3. 点击 "Create API Key"
4. 选择或创建一个 Google Cloud 项目
5. 复制生成的 API 密钥

### 配置

在 `.env.local` 文件中添加：

```env
GEMINI_API_KEY="AIzaSy..."
AI_PROVIDER="gemini"
```

### 可用模型

| 模型名称 | 用途 |
|---------|------|
| `gemini-2.0-flash-exp` | 快速对话（推荐） |
| `gemini-2.5-pro-exp-08-27` | 深度分析 |
| `gemini-2.5-flash-thinking-exp` | 复杂推理 |
| `text-embedding-004` | 语义搜索 |

### 定额

- 免费版：每分钟 15 次请求，每天 1500 次请求
- 适合开发测试和中小型应用

---

## DeepSeek API（备选）

### 获取 API 密钥

1. 访问 [DeepSeek Platform](https://platform.deepseek.com)
2. 注册账号并登录
3. 进入 API Keys 页面
4. 创建新的 API 密钥

### 配置

在 `.env.local` 文件中添加：

```env
DEEPSEEK_API_KEY="sk-..."
AI_PROVIDER="deepseek"
```

### 可用模型

| 模型名称 | 用途 |
|---------|------|
| `deepseek-chat` | 对话 |
| `deepseek-coder` | 代码 |
| `deepseek-reasoner` | 推理 |

---

## 测试 API 连接

### 方式1：通过项目测试

```bash
npm run dev
```

访问 http://localhost:3000/ai 进行测试

### 方式2：直接测试 API

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"什么是金刚经？"}'
```

---

## 环境变量参考

### 必须配置

```env
# AI 提供商选择
AI_PROVIDER="gemini"  # 或 "deepseek"

# 对应的 API 密钥
GEMINI_API_KEY="AIzaSy..."  # AI_PROVIDER=gemini 时
# 或
DEEPSEEK_API_KEY="sk-..."   # AI_PROVIDER=deepseek 时
```

### 可选配置

```env
# AI 系统提示词自定义（可选）
AI_SYSTEM_PROMPT="你是一位金刚经研究专家..."
```

---

## 故障排除

### 1. "API key not valid" 错误

- 检查 API 密钥是否正确复制
- 确认 API 密钥已启用
- 检查是否超过了使用配额

### 2. "Model not found" 错误

- 确认模型名称拼写正确
- 检查该模型在您的区域是否可用

### 3. 响应超时

- 检查网络连接
- 尝试切换到更快的模型（如 `gemini-2.0-flash-exp`）

---

## 成本参考

| 服务 | 免费配额 | 超出后费用 |
|------|----------|-----------|
| Gemini | 1500次/天 | 按使用量计费 |
| DeepSeek | 较为慷慨 | 按Token计费 |

对于学习/研究项目，免费配额通常足够。
