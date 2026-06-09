import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilWeekend())
  const [copied, setCopied] = useState(false)

  function getTimeUntilWeekend() {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday, 6 = Saturday

    // If it's Saturday or Sunday, it's the weekend
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isWeekend: true }
    }

    // Calculate days until Saturday
    const daysUntilSaturday = 6 - dayOfWeek

    // Target is midnight of Saturday
    const target = new Date(now)
    target.setDate(now.getDate() + daysUntilSaturday)
    target.setHours(0, 0, 0, 0)

    const diff = target - now

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds, isWeekend: false }
  }

  function getWeekProgress() {
    const now = new Date()
    const dayOfWeek = now.getDay()

    // If it's Saturday or Sunday, return 100%
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      return 100
    }

    // Convert to Monday = 0, Friday = 4
    const adjustedDay = dayOfWeek - 1

    // Calculate progress from Monday 00:00 to Saturday 00:00 (5 days)
    const hoursIntoWeek = adjustedDay * 24 + now.getHours() + now.getMinutes() / 60
    const totalHours = 5 * 24 // Monday to Saturday

    return Math.min((hoursIntoWeek / totalHours) * 100, 100)
  }

  const [progress, setProgress] = useState(getWeekProgress())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilWeekend())
      setProgress(getWeekProgress())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleCopy = async () => {
    const text = timeLeft.isWeekend
      ? "It's the weekend! 🎉"
      : `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds until the weekend`

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">
          <span className="emoji">🏖️</span> Weekend Countdown
        </h1>

        <p className="subtitle">Time until Saturday</p>

        {timeLeft.isWeekend ? (
          <div className="weekend-message">
            <span className="party-emoji">🎉</span>
            <h2>It's the Weekend!</h2>
            <p>Enjoy your time off!</p>
          </div>
        ) : (
          <div className="countdown-wrapper">
            <div className="countdown">
              <div className="time-block">
                <span className="time-value">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="time-label">Days</span>
              </div>
              <span className="separator">:</span>
              <div className="time-block">
                <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="time-label">Hours</span>
              </div>
              <span className="separator">:</span>
              <div className="time-block">
                <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="time-label">Minutes</span>
              </div>
              <span className="separator">:</span>
              <div className="time-block">
                <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="time-label">Seconds</span>
              </div>
            </div>

            <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
              {copied ? (
                <>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        )}

        <div className="progress-section">
          <div className="progress-header">
            <span>Week Progress</span>
            <span className="progress-percent">{progress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
          <div className="progress-labels">
            <span>Mon</span>
            <span>Sat</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
