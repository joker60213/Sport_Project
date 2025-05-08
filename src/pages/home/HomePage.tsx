import styles from './HomePage.module.scss'
import { useState } from 'react'
import { Button, Modal, Card, Rate, message } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, AppstoreAddOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'

// Используем те же данные тренеров, что и на странице тренеров
const trainers = [
  {
    id: 1,
    name: 'Алексей',
    specialty: 'фитнес',
    img: 'https://via.placeholder.com/200x200?text=Алексей',
    rating: 4.5
  },
  {
    id: 2,
    name: 'Мария',
    specialty: 'йога',
    img: 'https://via.placeholder.com/200x200?text=Мария',
    rating: 5
  },
  {
    id: 3,
    name: 'Иван',
    specialty: 'бокс',
    img: 'https://via.placeholder.com/200x200?text=Иван',
    rating: 4
  },
  {
    id: 4,
    name: 'Ольга',
    specialty: 'фитнес',
    img: 'https://via.placeholder.com/200x200?text=Ольга',
    rating: 4.7
  },
]

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const selectTrainer = (trainer: typeof trainers[0]) => {
    message.success(`Вы выбрали тренера: ${trainer.name}`)
    setIsModalOpen(false)
  }

  return (
    <>
      <div className={styles.hero}>
        <h1>Твой спорт — твои правила</h1>
        <p>Занимайся с лучшими тренерами. Онлайн и офлайн.</p>
        <Button type="primary" size="large" onClick={openModal}>Записаться</Button>
      </div>

      <div className={styles.features}>
  <div className={styles.card}>
    <ClockCircleOutlined style={{ fontSize: 24, color: '#56ab2f' }} />
    <span>Удобное расписание</span>
  </div>
  <div className={styles.card}>
    <AppstoreAddOutlined style={{ fontSize: 24, color: '#56ab2f' }} />
    <span>Персональный подход</span>
  </div>
  <div className={styles.card}>
    <CheckCircleOutlined style={{ fontSize: 24, color: '#56ab2f' }} />
    <span>Прогресс в приложении</span>
  </div>
</div>

<div className={styles.target}>
  <h2>Для кого этот сервис?</h2>
  <div className={styles.cards}>
    <div className={styles.card}>
      <UserOutlined style={{ fontSize: 40, color: '#56ab2f' }} />
      <h3>Для клиентов</h3>
      <p>Легко находите тренировки, записывайтесь и отслеживайте прогресс.</p>
    </div>
    <div className={styles.card}>
      <TeamOutlined style={{ fontSize: 40, color: '#56ab2f' }} />
      <h3>Для тренеров</h3>
      <p>Управляйте расписанием, клиентами.</p>
    </div>
  </div>
</div>

<div className={styles.testimonials}>
  <h2>Отзывы наших клиентов</h2>
  <div className={styles.cards}>
    <div className={styles.card}>
      <p>"Удобный сервис, легко записаться и всё видно в одном месте!"</p>
      <span>— Анна, клиент</span>
    </div>
    <div className={styles.card}>
      <p>"Теперь мои тренировки под контролем. Идеально!"</p>
      <span>— Игорь, тренер</span>
    </div>
    <div className={styles.card}>
      <p>"Очень понравился интерфейс, и всё на русском — супер!"</p>
      <span>— Мария, клиент</span>
    </div>
  </div>
</div>

      {/* Модальное окно для выбора тренера */}
      <Modal
        title="Выберите тренера"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <div className={styles.trainerGrid}>
          {trainers.map(trainer => (
            <Card 
              key={trainer.id} 
              hoverable
              onClick={() => selectTrainer(trainer)}
              style={{ width: '100%', marginBottom: 16 }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src={trainer.img} 
                  alt={trainer.name}
                  style={{ width: 80, height: 80, borderRadius: '50%', marginRight: 16 }} 
                />
                <div>
                  <h3>{trainer.name}</h3>
                  <div>Специализация: {trainer.specialty}</div>
                  <Rate allowHalf defaultValue={trainer.rating} disabled style={{ fontSize: 16, marginTop: 4 }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </>
  )
}

export default HomePage
