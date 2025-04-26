import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Radio, Typography } from 'antd'
import './LoginPage.scss'

const { Title } = Typography

interface LoginPageProps {
  setUser: (user: { name: string; role: 'client' | 'trainer'; trial?: boolean }) => void
}

const LoginPage = ({ setUser }: LoginPageProps) => {
  const [name, setName] = useState('')
  const [role, setRole] = useState<'client' | 'trainer'>('client')
  const [redirect, setRedirect] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const navigate = useNavigate()

  useEffect(() => {
    if (redirect) {
      const timer = setTimeout(() => {
        navigate('/')
      }, 3000)
      
      const interval = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
      
      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    }
  }, [redirect, navigate])

  const handleLogin = () => {
    if (!name) return

    const user = {
      name,
      role,
      trial: true, // добавляем триал при первом входе
    }

    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    setRedirect(true)
  }

  return (
    <div className="login">
      <div className="login-box">
        <Title level={2}>Вход</Title>

        <Input
          placeholder="Введите ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Radio.Group
          onChange={(e) => setRole(e.target.value)}
          value={role}
          style={{ marginTop: 20 }}
        >
          <Radio.Button value="client">Я клиент</Radio.Button>
          <Radio.Button value="trainer">Я тренер</Radio.Button>
        </Radio.Group>

        <Button
          type="primary"
          block
          style={{ marginTop: 24 }}
          onClick={handleLogin}
          disabled={!name}
        >
          Войти
        </Button>
        
        {redirect && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            Перенаправление на главную страницу через {countdown} сек...
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginPage
