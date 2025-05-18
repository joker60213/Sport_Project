import { useEffect, useState } from 'react'
import { Switch } from 'antd'
import { BulbOutlined, BulbFilled } from '@ant-design/icons'

interface ThemeSwitcherProps {
  onChange?: (darkMode: boolean) => void;
  initialValue?: boolean;
}

const ThemeSwitcher = ({ onChange, initialValue = false }: ThemeSwitcherProps) => {
  const [dark, setDark] = useState(initialValue)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' && !initialValue) setDark(true)
  }, [initialValue])

  const handleChange = (checked: boolean) => {
    setDark(checked)
    if (onChange) {
      onChange(checked)
    } else {
      // Для обратной совместимости, если onChange не предоставлен
      document.documentElement.setAttribute('data-theme', checked ? 'dark' : 'light')
      localStorage.setItem('theme', checked ? 'dark' : 'light')
    }
  }

  return (
    <div style={{ position: 'fixed', top: 24, right: 40, zIndex: 2000 }}>
      <Switch
        checked={dark}
        onChange={handleChange}
        checkedChildren={<BulbFilled />}
        unCheckedChildren={<BulbOutlined />}
      />
    </div>
  )
}

export default ThemeSwitcher 