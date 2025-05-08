import { useState } from 'react'
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
  const navigate = useNavigate()

  const handleLogin = () => {
    if (!name) return

    const user = {
      name,
      role,
      trial: true, // добавляем триал при первом входе
    }

    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    navigate('/')
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
      </div>
    </div>
  )
}

export default LoginPage
