import Logo from '@/assets/crx.svg'
import { useEffect, useState } from 'react'
import './App.css'
import { Overlay2 } from '@/components/Overlay2'
import { ScreenshotRecord, ScreenshotsDB } from '@/utils/db'

function App() {
  const [show, setShow] = useState(false)
  const toggle = () => setShow(!show)

  const [_, setError] = useState<string | null>(null)
  const [__, setIsCapturing] = useState(false)

  // DB instance
  const db = new ScreenshotsDB()

  // Capture screenshot and persist
  async function takeScreenshot () {
    setIsCapturing(true)
    setError(null)

    try {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      })

      if (activeTab?.windowId == null) {
        throw new Error('No active tab found')
      }

      const imageDataUrl = await chrome.tabs.captureVisibleTab(
        activeTab.windowId,
        { format: 'png' }
      )

      const rec: ScreenshotRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        dataUrl: imageDataUrl
      }

      await db.add(rec)
      // optional: show a quick toast or update UI
    } catch (err) {
      console.error(err)
      setError('Unable to capture the active tab.')
    } finally {
      setIsCapturing(false)
    }
  }

  async function takeImmediateScreenshot () {
    setIsCapturing(true)
    setError(null)

    try {

      const [activeTab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      })

      if (activeTab?.windowId == null) {
        throw new Error('No active tab found')
      }

      // Capture the visible tab as a data URL
      const imageDataUrl = await chrome.tabs.captureVisibleTab(
        activeTab.windowId,
        { format: 'png' }
      )

      // Convert data URL to a blob and trigger a download immediately
      const response = await fetch(imageDataUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `screenshot-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      // Persist if you still want to store in DB alongside download
      // const rec: ScreenshotRecord = {
      // id: ${Date.now()}-${Math.random().toString(36).slice(2, 7)},
      // timestamp: Date.now(),
      // dataUrl: imageDataUrl
      // }
      // await db.add(rec)

    } catch (err) {
      console.error(err)
      setError('Unable to capture the active tab.')
    } finally {
      setIsCapturing(false)
    } 
  }

  // Keyboard handler (S key) remains
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if (isTyping) return

      if (event.key.toLowerCase() === 's') {
        event.preventDefault()
        void takeScreenshot()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="popup-container">
      {show && (
        <Overlay2/>
      )}
      <button className="toggle-button" onClick={toggle}>
        <img src={Logo} alt="CRXJS logo" className="button-icon" />
      </button>
      <button className="toggle-button" onClick={takeImmediateScreenshot}>
        <img src={Logo} alt="CRXJS logo" className="button-icon" />
      </button>
    </div>
  )
}

export default App
