# 检查端口占用
$port = 3001
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1

if ($process) {
  Write-Host "🔍 端口 $port 被占用:" -ForegroundColor Yellow
  Write-Host "   进程: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Cyan
  Write-Host "   正在停止进程..." -ForegroundColor Yellow
  Stop-Process -Id $process.Id -Force
  Write-Host "   ✅ 进程已停止" -ForegroundColor Green
  Write-Host ""
}

# 启动服务器
Write-Host "🚀 启动开发服务器..." -ForegroundColor Cyan
npm run dev
