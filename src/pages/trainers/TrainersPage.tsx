import { useState } from 'react'
import { Button, Card, Select, Typography, Modal, Input, message, Rate } from 'antd'
import styles from './TrainersPage.module.scss'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

const allTrainers = [
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

const TrainersPage = () => {
  const [filter, setFilter] = useState('все')
  const [selectedTrainer, setSelectedTrainer] = useState<null | typeof allTrainers[0]>(null)
  const [comment, setComment] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filtered = filter === 'все' ? allTrainers : allTrainers.filter(t => t.specialty === filter)

  const handleOpenModal = (trainer: typeof allTrainers[0]) => {
    setSelectedTrainer(trainer)
    setIsModalOpen(true)
  }

  const handleSubmit = () => {
    message.success(`Вы записались к тренеру ${selectedTrainer?.name}`)
    setIsModalOpen(false)
    setComment('')
  }

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <Title level={2}>Наши тренеры</Title>

        <Select
          value={filter}
          onChange={(value) => setFilter(value)}
          style={{ width: 200, marginBottom: 24 }}
        >
          <Option value="все">Все направления</Option>
          <Option value="фитнес">Фитнес</Option>
          <Option value="йога">Йога</Option>
          <Option value="бокс">Бокс</Option>
        </Select>

        <div className={styles.cards}>
          {filtered.map((trainer) => (
            <Card
              key={trainer.id}
              cover={<img alt={trainer.name} src={trainer.img} />}
              className={styles.card}
            >
              <Card.Meta
                title={trainer.name}
                description={
                  <>
                    <div>Специализация: {trainer.specialty}</div>
                    <Rate allowHalf defaultValue={trainer.rating} disabled style={{ fontSize: 16, marginTop: 8 }} />
                  </>
                }
              />
              <Button
                type="primary"
                block
                style={{ marginTop: 16 }}
                onClick={() => handleOpenModal(trainer)}
              >
                Записаться
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Модалка */}
      <Modal
        title={`Запись к ${selectedTrainer?.name}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText="Записаться"
      >
        {selectedTrainer && (
          <div style={{ display: 'flex', marginBottom: 16, alignItems: 'center' }}>
            <img 
              src={selectedTrainer.img} 
              alt={selectedTrainer.name} 
              style={{ width: 80, height: 80, marginRight: 16, borderRadius: '50%' }} 
            />
            <div>
              <h3>{selectedTrainer.name}</h3>
              <div>Специализация: {selectedTrainer.specialty}</div>
              <Rate allowHalf defaultValue={selectedTrainer.rating} disabled style={{ fontSize: 16, marginTop: 4 }} />
            </div>
          </div>
        )}
        <p>Ваш комментарий (необязательно):</p>
        <TextArea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Например, хочу на индивидуальную тренировку"
        />
      </Modal>
    </div>
  )
}


export default TrainersPage
