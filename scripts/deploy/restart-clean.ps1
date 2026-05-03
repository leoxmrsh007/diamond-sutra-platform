# 停止所有 Node 进程
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# 删除 Next.js 锁文件
$lockFile = ".next\dev\lock"
if (Test-Path $lockFile) { Remove-Item $lockFile }

# 启动服务器
npm run dev
