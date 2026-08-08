import Logo from '@/assets/crx.svg'
import { useEffect, useState } from 'react'
import './App.css'
import { Overlay2 } from '@/components/Overlay2'
import { ScreenshotRecord, ScreenshotsDB } from '@/utils/db'

function App() {
  const [show, setShow] = useState(false)
  const toggle = () => setShow(!show)

  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

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
    </div>
  )
}

export default App
