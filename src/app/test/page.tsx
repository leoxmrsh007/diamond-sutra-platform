export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">测试页面</h1>
        <p className="text-xl text-muted-foreground">
          如果您能看到此页面，说明路由工作正常
        </p>
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-green-100 rounded-lg">
            <p className="font-semibold">✓ 路由工作正常</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg">
            <p>访问测试页面：/test</p>
          </div>
        </div>
      </div>
    </div>
  );
}
