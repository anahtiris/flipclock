import React from 'react'
import ReactDOM from 'react-dom/client'
import { FlipClock } from './components/FlipClock'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: 40, background: '#111', minHeight: '100vh', display: 'flex', gap: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <FlipClock mode="date" defaultValue={{ year: 2026, month: 5, day: 23 }} onChange={console.log} />
      <FlipClock mode="time" defaultValue={{ hour: 9, minute: 30 }} onChange={console.log} hour12={false} />
      <FlipClock mode="date" theme="light" defaultValue={{ year: 2026, month: 5, day: 23 }} onChange={console.log} />
    </div>
  </React.StrictMode>
)
