import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import HomePage from './pages/home/HomePage'
import PricingPage from './pages/pricing/PricingPage'
import TrainersPage from './pages/trainers/TrainersPage'
import ContactsPage from './pages/contacts/ContactsPage'
import LoginPage from './pages/login/LoginPage'
import AccountPage from './pages/account/AccountPage'
import ClientDetailsPage from './pages/clientDetails/ClientDetailsPage'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { Spin, ConfigProvider, theme } from 'antd'
import ThemeSwitcher from './components/ThemeSwitcher'

// Определяем тип User для всего приложения
type User = {
  name: string;
  role: 'client' | 'trainer';
  trial?: boolean;
  specialty?: string;
  about?: string;
  img?: string;
  rating?: number;
  education?: string;
  experience?: string;
  extraInfo?: string;
  services?: {id: number; name: string; price: number}[];
  gallery?: string[];
  certificates?: string[];
  reviews?: {id: number; author: string; text: string; rating: number; date: string; specialization?: string; price?: number}[];
}

const App = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {
        localStorage.removeItem('user')
        setUser(null)
      }
    }
    setIsAuthLoading(false)
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const handleThemeChange = (darkMode: boolean) => {
    setIsDarkMode(darkMode)
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }

  if (isAuthLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Spin size="large" /></div>
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDarkMode ? '#52c41a' : '#56ab2f',
          colorSuccess: '#52c41a',
          colorWarning: '#f8b500',
          colorError: '#ff4d4f',
          colorInfo: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <ThemeSwitcher onChange={handleThemeChange} initialValue={isDarkMode} />
        <Header user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/account" element={<AccountPage user={user} setUser={setUser} isAuthLoading={isAuthLoading} />} />
          <Route path="/client/:clientId" element={<ClientDetailsPage user={user} />} />
          {/* опционально: редирект на главную, если путь неизвестен */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
