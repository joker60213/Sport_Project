import { Menu, Drawer, Button, Dropdown, MenuProps } from 'antd'
import { MenuOutlined, UserOutlined, DownOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Header.scss'

const menuItems = [
  { label: <Link to="/">Главная</Link>, key: 'home' },
  { label: <Link to="/trainers">Тренеры</Link>, key: 'trainers' },
  { label: <Link to="/contacts">Контакты</Link>, key: 'contacts' },
  { label: <Link to="/pricing">Подписка</Link>, key: 'pricing' },
]

interface HeaderProps {
  user: { name: string; role: 'client' | 'trainer'; trial?: boolean } | null
  setUser: (user: { name: string; role: 'client' | 'trainer'; trial?: boolean } | null) => void
}

const Header = ({ user, setUser }: HeaderProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'account',
      label: <Link to="/account">Личный кабинет</Link>,
    },
    {
      key: 'logout',
      label: <span onClick={handleLogout}>Выйти</span>,
    },
  ]

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">SportClub</Link>
        </div>

        <div className="desktop-menu">
          <Menu mode="horizontal" items={menuItems} />
        </div>

        <div className="mobile-menu-button">
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 24 }} />}
            onClick={() => setOpen(true)}
          />
        </div>

        <Drawer
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
          title="Меню"
        >
          <Menu mode="vertical" items={menuItems} onClick={() => setOpen(false)} />
        </Drawer>

        <div className="auth-block">
          {user ? (
            <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
              <div className="profile-link">
                <UserOutlined style={{ fontSize: 20, marginRight: 6 }} />
                {user.name}
                <DownOutlined style={{ fontSize: 12, marginLeft: 4 }} />
              </div>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button type="primary">Войти</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
