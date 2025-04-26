import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import HomePage from './pages/home/HomePage'
import PricingPage from './pages/pricing/PricingPage'
import TrainersPage from './pages/trainers/TrainersPage'
import ContactsPage from './pages/contacts/ContactsPage'
import LoginPage from './pages/login/LoginPage'
import AccountPage from './pages/account/AccountPage'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// Определяем тип User для всего приложения
type User = {
  name: string;
  role: 'client' | 'trainer';
  trial?: boolean;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) {
      setUser(JSON.parse(saved))
    }
  }, [])

  return (
    <BrowserRouter>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/account" element={<AccountPage user={user} setUser={setUser} />} />

        {/* опционально: редирект на главную, если путь неизвестен */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
