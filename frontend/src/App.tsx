import { useState } from 'react'
import { AuthModal } from './components/AuthModal'
import { LandingPage } from './LandingPage'
import { ThemeProvider } from './context/ThemeContext'

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState('')
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup')

  const openSignup = (domain?: string) => {
    setSelectedDomain(domain ?? '')
    setAuthMode('signup')
    setAuthModalOpen(true)
  }

  return (
    <>
      <LandingPage onAnalyze={openSignup} onLogin={() => { setAuthMode('login'); setAuthModalOpen(true) }} />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialDomain={selectedDomain}
        initialMode={authMode}
        onSuccess={(targetUrl) => {
          setAuthModalOpen(false)
          if (targetUrl) window.location.assign(targetUrl)
        }}
      />
    </>
  )
}

export function App() {
  return <ThemeProvider><AppContent /></ThemeProvider>
}

export default App
