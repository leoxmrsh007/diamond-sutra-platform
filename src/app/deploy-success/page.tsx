export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-green-800">✅ 部署成功！</h1>
        <p className="text-xl text-green-700 mb-8">
          如果您能看到此页面，说明部署已成功
        </p>
        <div className="space-y-4 bg-white p-8 rounded-lg shadow-lg">
          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
            <p className="text-blue-900 font-semibold text-lg">第1-3章版本对照功能</p>
            <p className="text-sm text-blue-700 mt-2">
              请访问 <a href="/study" className="underline text-blue-600 hover:text-blue-800">/study</a> 查看学习页面
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
            <p className="text-amber-900 font-semibold text-lg">包含功能</p>
            <ul className="text-left mt-2 text-sm text-amber-700 space-y-1">
              <li>✓ 第1-3章选择器</li>
              <li>✓ 5种版本对照</li>
              <li>✓ 核心偈颂标记</li>
              <li>✓ 美观的UI界面</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-gray-500">
          <p>部署时间：{new Date().toLocaleString('zh-CN')}</p>
        </div>
      </div>
    </div>
  );
}
