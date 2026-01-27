/**
 * Service Worker 注册组件
 */

'use client'

import { useEffect } from 'react'
import { registerSW } from '@/lib/sw'

export function SWRegister() {
  useEffect(() => {
    registerSW()
  }, [])

  return null
}
