import { Input, Button, Typography } from 'antd'
import { useState } from 'react'
import styles from './ContactsPage.module.scss'

const { Title } = Typography
const { TextArea } = Input

const ContactsPage = () => {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (!name || !message) return
    alert(`Спасибо, ${name}! Ваше сообщение отправлено.`)
    setName('')
    setMessage('')
  }

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <Title level={2}>Контакты</Title>

        <div className={styles.info}>
          <p>Email: Тут почта</p>
          <p>Telegram: Тут контакты телеги</p>
          <p>Адрес: Тут адрес</p>
        </div>

        <div className={styles.form}>
          <Title level={4}>Напишите нам</Title>
          <Input
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextArea
            placeholder="Сообщение"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="primary" onClick={handleSubmit} disabled={!name || !message}>
            Отправить
          </Button>
        </div>

        <div className={styles.map}>
          <div className={styles.fakeMap}>[ Карта заглушка ]</div>
        </div>
      </div>
    </div>
  )
}

export default ContactsPage
