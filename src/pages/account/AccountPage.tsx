import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Typography, Alert } from 'antd'
import './AccountPage.scss'

const { Title, Text } = Typography

interface User {
  name: string
  role: 'client' | 'trainer'
  trial?: boolean
}

interface AccountPageProps {
  user: User | null
  setUser: (user: User | null) => void
}

const AccountPage = ({ user, setUser }: AccountPageProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const endTrial = () => {
    if (!user) return
    const updated = { ...user, trial: false }
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
  }

  if (!user) return null

  return (
    <div className="account">
      <div className="account-box">
        <Title level={2}>Личный кабинет</Title>
        <Text strong>Имя:</Text> <Text>{user.name}</Text> <br />
        <Text strong>Роль:</Text> <Text>{user.role === 'client' ? 'Клиент' : 'Тренер'}</Text>

        <div className="account-content">
          {user.role === 'client' && (
            <>
              <Title level={4}>Добро пожаловать, клиент!</Title>
              {user.trial !== false ? (
                <>
                  <Alert
                    message="У вас активен бесплатный пробный период (7 дней)"
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <Button onClick={endTrial} danger>
                    Завершить пробный доступ
                  </Button>
                </>
              ) : (
                <Alert
                  message="Пробный период завершён"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}
            </>
          )}

          {user.role === 'trainer' && (
            <>
              <Title level={4}>Добро пожаловать, тренер!</Title>
              <p>Вы можете управлять своими тренировками и клиентами.</p>
            </>
          )}
        </div>

        <Button type="primary" danger onClick={handleLogout}>
          Выйти
        </Button>
      </div>
    </div>
  )
}

export default AccountPage
