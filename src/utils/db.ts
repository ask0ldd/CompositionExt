// src/utils/db.ts
export type ScreenshotRecord = {
  id: string
  timestamp: number
  dataUrl: string // or you can store binary Blob via blob storage
  width?: number
  height?: number
}

export class ScreenshotsDB {
  private db?: IDBDatabase

  async open(): Promise<void> {
    if (this.db) return
    this.db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('crx_screenshots', 1)
      req.onupgradeneeded = () => {
        const db = req.result
        if (!db.objectStoreNames.contains('shots')) {
          db.createObjectStore('shots', { keyPath: 'id' })
        }
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
  }

  async add(record: ScreenshotRecord): Promise<void> {
    await this.open()
    return new Promise<void>((resolve, reject) => {
      const tx = this.db!.transaction('shots', 'readwrite')
      tx.objectStore('shots').add(record)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async getAll(): Promise<ScreenshotRecord[]> {
    await this.open()
    return new Promise<ScreenshotRecord[]>((resolve, reject) => {
      const tx = this.db!.transaction('shots', 'readonly')
      const req = tx.objectStore('shots').getAll()
      req.onsuccess = () => resolve(req.result as ScreenshotRecord[])
      req.onerror = () => reject(req.error)
    })
  }

  async clearAll(): Promise<void> {
    await this.open()
    return new Promise<void>((resolve, reject) => {
      const tx = this.db!.transaction('shots', 'readwrite')
      tx.objectStore('shots').clear()
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }
}