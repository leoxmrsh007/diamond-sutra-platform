# 金刚经研究平台 - 生产部署助手脚本
# 使用方法: .\deploy-production.ps1

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "金刚经研究平台 - 生产部署助手" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 检查当前状态
Write-Host "[1/6] 检查当前状态..." -ForegroundColor Yellow

# 检查Git状态
Write-Host "检查Git状态..." -ForegroundColor Gray
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  有未提交的更改:" -ForegroundColor Yellow
    $gitStatus | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    $choice = Read-Host "是否提交更改? (y/n)"
    if ($choice -eq 'y') {
        git add .
        $commitMsg = Read-Host "输入提交信息"
        if (-not $commitMsg) { $commitMsg = "准备生产部署" }
        git commit -m $commitMsg
        git push origin main
        Write-Host "✅ 代码已提交并推送" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Git工作区干净" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/6] 检查生产部署状态..." -ForegroundColor Yellow

# 检查当前部署域名
$vercelUrl = "https://diamond-sutra-platform-dc43r6kfk-leo007s-projects.vercel.app"
Write-Host "当前部署URL: $vercelUrl" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri "$vercelUrl/api/check-env" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ 部署可访问" -ForegroundColor Green
    } else {
        Write-Host "⚠️  部署返回状态码: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  无法访问部署URL: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[3/6] 环境变量检查..." -ForegroundColor Yellow

Write-Host "必需的环境变量:" -ForegroundColor Gray
Write-Host "  1. DATABASE_URL      - PostgreSQL数据库连接字符串" -ForegroundColor Gray
Write-Host "  2. NEXTAUTH_URL      - 部署域名 (例如: $vercelUrl)" -ForegroundColor Gray
Write-Host "  3. NEXTAUTH_SECRET   - 认证密钥 (已提供: 2b0240a45b5eddfeb0c1935e3d2b9845543797b28307b7ed0620e9cd95afc393)" -ForegroundColor Gray
Write-Host "  4. (可选) AI_API_KEY - Gemini或DeepSeek API密钥" -ForegroundColor Gray

Write-Host ""
Write-Host "📋 请在Vercel控制台配置环境变量:" -ForegroundColor Cyan
Write-Host "  1. 访问 https://vercel.com/leo007s-projects/diamond-sutra-platform/settings/environment-variables" -ForegroundColor Gray
Write-Host "  2. 点击 'Add New'" -ForegroundColor Gray
Write-Host "  3. 添加上述环境变量" -ForegroundColor Gray
Write-Host "  4. 选择 'Production' 环境" -ForegroundColor Gray
Write-Host "  5. 点击 'Save'" -ForegroundColor Gray

Write-Host ""
Write-Host "[4/6] 数据库设置指南..." -ForegroundColor Yellow

Write-Host "选择数据库方案:" -ForegroundColor Cyan
Write-Host "  A) Vercel Postgres (推荐)" -ForegroundColor Gray
Write-Host "     1. 在Vercel Dashboard点击 'Storage'" -ForegroundColor Gray
Write-Host "     2. 点击 'Create Database'" -ForegroundColor Gray
Write-Host "     3. 选择PostgreSQL，设置名称" -ForegroundColor Gray
Write-Host "     4. 选择区域 'Hong Kong (hkg1)'" -ForegroundColor Gray
Write-Host "     5. 创建后复制连接字符串到 DATABASE_URL" -ForegroundColor Gray
Write-Host ""
Write-Host "  B) Supabase (免费)" -ForegroundColor Gray
Write-Host "     1. 访问 https://supabase.com" -ForegroundColor Gray
Write-Host "     2. 创建新项目" -ForegroundColor Gray
Write-Host "     3. 在 Project Settings → Database 获取连接字符串" -ForegroundColor Gray
Write-Host "     4. 格式: postgresql://postgres:[password]@[host]:5432/postgres" -ForegroundColor Gray

Write-Host ""
Write-Host "[5/6] 触发重新部署..." -ForegroundColor Yellow

$triggerDeploy = Read-Host "是否触发重新部署? (环境变量配置完成后执行) (y/n)"
if ($triggerDeploy -eq 'y') {
    Write-Host "触发重新部署..." -ForegroundColor Gray
    git commit --allow-empty -m "触发生产重新部署"
    git push origin main
    Write-Host "✅ 已触发重新部署" -ForegroundColor Green
    Write-Host "请在Vercel Dashboard查看部署进度" -ForegroundColor Gray
    Write-Host "部署URL: https://vercel.com/leo007s-projects/diamond-sutra-platform/deployments" -ForegroundColor Gray
} else {
    Write-Host "跳过部署触发" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[6/6] 数据库初始化..." -ForegroundColor Yellow

Write-Host "部署完成后需要初始化数据库:" -ForegroundColor Cyan
Write-Host "  1. 等待部署完成 (约2-3分钟)" -ForegroundColor Gray
Write-Host "  2. 访问初始化端点:" -ForegroundColor Gray
Write-Host "     $vercelUrl/api/init-database" -ForegroundColor Gray
Write-Host "  3. 或运行: curl -X GET `"$vercelUrl/api/init-database`"" -ForegroundColor Gray
Write-Host "  4. 应该返回成功消息" -ForegroundColor Gray

Write-Host ""
Write-Host "🧪 功能测试:" -ForegroundColor Cyan
Write-Host "  1. 访问研究页面: $vercelUrl/research" -ForegroundColor Gray
Write-Host "  2. 测试登录: $vercelUrl/login" -ForegroundColor Gray
Write-Host "     - 邮箱: admin@example.com" -ForegroundColor Gray
Write-Host "     - 密码: Admin@123" -ForegroundColor Gray
Write-Host "  3. 检查API状态: $vercelUrl/api/check-env" -ForegroundColor Gray

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "部署完成!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 参考文档:" -ForegroundColor Cyan
Write-Host "  - COMPLETE_DEPLOYMENT_CHECKLIST.md - 完整部署检查清单" -ForegroundColor Gray
Write-Host "  - VERCEL_ENV.md - Vercel环境变量配置" -ForegroundColor Gray
Write-Host "  - PROJECT_STATUS_SUMMARY.md - 项目状态总结" -ForegroundColor Gray
Write-Host ""
Write-Host "🆘 遇到问题?" -ForegroundColor Cyan
Write-Host "  1. 检查Vercel部署日志" -ForegroundColor Gray
Write-Host "  2. 查看项目文档" -ForegroundColor Gray
Write-Host "  3. 重新运行此脚本" -ForegroundColor Gray