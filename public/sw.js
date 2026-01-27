/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = 'diamond-sutra-v1'
const urlsToCache = [
  '/',
  '/study',
  '/ai',
  '/courses',
  '/community',
  '/profile',
  '/settings',
  '/offline',
]

// 安装 Service Worker
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

// 激活 Service Worker
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// 拦截请求
self.addEventListener('fetch', (event: FetchEvent) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return

  // 跳过 API 请求
  if (event.request.url.includes('/api/')) return

  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果缓存中有，返回缓存
      if (response) {
        return response
      }

      // 否则发起网络请求
      return fetch(event.request).then((response) => {
        // 如果响应无效，直接返回
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // 克隆响应
        const responseToCache = response.clone()

        // 缓存新资源
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      }).catch(() => {
        // 网络请求失败，返回离线页面
        if (event.request.destination === 'document') {
          return caches.match('/offline')
        }
      })
    })
  )
})

// 后台同步
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-notes') {
    event.waitUntil(syncNotes())
  }
})

async function syncNotes() {
  // 同步笔记逻辑
  try {
    const response = await fetch('/api/notes/sync', {
      method: 'POST',
    })
    if (response.ok) {
      console.log('Notes synced successfully')
    }
  } catch (error) {
    console.error('Failed to sync notes:', error)
  }
}

export {}
