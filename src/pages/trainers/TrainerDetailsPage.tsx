import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Card, Button, Avatar, Row, Col, Tag, Divider, Rate, Space, List } from 'antd'
import { 
  UserOutlined, LeftOutlined, CheckCircleOutlined, 
  MailOutlined, PhoneOutlined, MessageOutlined 
} from '@ant-design/icons'
import './TrainerDetailsPage.scss'

const { Title, Text, Paragraph } = Typography

interface TrainerDetailsPageProps {
  user: {
    name: string
    role: 'client' | 'trainer'
  } | null
}

// Моковые данные о тренерах
const mockTrainers = [
  {
    id: 1,
    name: 'Алексей Тренер',
    specialty: 'Фитнес, Силовые тренировки',
    img: 'https://xsgames.co/randomusers/assets/avatars/male/8.jpg',
    rating: 4.8,
    experience: '5 лет',
    about: 'Профессиональный фитнес-тренер с сертификацией NASM. Специализируюсь на силовых тренировках и функциональном тренинге.',
    fullBio: `Профессиональный фитнес-тренер с 5-летним опытом работы. Имею сертификацию NASM и специализируюсь на силовых тренировках и функциональном тренинге.

Мой подход к тренировкам основан на индивидуальных потребностях каждого клиента. Я разрабатываю персонализированные программы, которые помогают эффективно достигать поставленных целей, будь то снижение веса, набор мышечной массы или улучшение общей физической формы.

В своей работе я использую научно обоснованные методики и постоянно совершенствую свои знания в области физиологии, биомеханики и спортивного питания.`,
    education: 'Высшее образование в области физической культуры и спорта, сертификация NASM',
    achievements: [
      'Подготовил более 100 клиентов к достижению их фитнес-целей',
      'Участник международных конференций по фитнесу',
      'Автор статей о силовых тренировках'
    ],
    services: [
      { name: 'Персональная тренировка', price: 2000 },
      { name: 'Программа тренировок на месяц', price: 5000 },
      { name: 'Консультация по питанию', price: 1500 }
    ],
    contacts: 'Email: trainer@example.com, Телефон: +7 (999) 123-45-67'
  },
  {
    id: 2,
    name: 'Мария Йогина',
    specialty: 'Йога, Растяжка',
    img: 'https://xsgames.co/randomusers/assets/avatars/female/12.jpg',
    rating: 4.9,
    experience: '7 лет',
    about: 'Сертифицированный инструктор по йоге. Практикую и преподаю хатха и аштанга-йогу.',
    fullBio: `Сертифицированный инструктор по йоге с 7-летним опытом преподавания. Я практикую и преподаю различные направления йоги, включая хатха, аштанга и виньяса-флоу.

Мой путь в йоге начался более 10 лет назад, когда я искала способ справиться со стрессом и улучшить физическую форму. Йога изменила мою жизнь настолько, что я решила сделать ее своей профессией.

Я помогаю своим ученикам не только совершенствовать физическое тело, но и находить гармонию ума. Моя цель — сделать йогу доступной для всех, независимо от уровня подготовки и возраста.`,
    education: 'Сертификация RYT-500, курсы по анатомии и физиологии',
    achievements: [
      'Обучила более 500 учеников',
      'Проводила мастер-классы на международных фестивалях йоги',
      'Автор курса "Йога для начинающих"'
    ],
    services: [
      { name: 'Индивидуальное занятие', price: 1800 },
      { name: 'Групповое занятие (до 5 человек)', price: 1000 },
      { name: 'Интенсив-курс (10 занятий)', price: 15000 }
    ],
    contacts: 'Email: yoga@example.com, Телефон: +7 (999) 234-56-78'
  }
];

const TrainerDetailsPage = ({ user }: TrainerDetailsPageProps) => {
  const { trainerId } = useParams<{ trainerId: string }>();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState<typeof mockTrainers[0] | null>(null);

  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API
    const foundTrainer = mockTrainers.find(t => t.id === Number(trainerId));
    if (foundTrainer) {
      setTrainer(foundTrainer);
    }
  }, [trainerId]);

  if (!trainer) {
    return (
      <div className="trainer-not-found">
        <Title level={3}>Тренер не найден</Title>
        <Button onClick={() => navigate('/trainers')}>Вернуться к списку тренеров</Button>
      </div>
    );
  }

  return (
    <div className="trainer-details-page">
      <div className="container">
        <Button 
          icon={<LeftOutlined />} 
          onClick={() => navigate('/trainers')}
          className="back-button"
        >
          Вернуться к списку тренеров
        </Button>
        
        <Card className="trainer-header-card">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} sm={8} md={6}>
              <Avatar
                src={trainer.img}
                icon={!trainer.img && <UserOutlined />}
                size={200}
                className="trainer-avatar"
              />
            </Col>
            <Col xs={24} sm={16} md={18}>
              <Title level={2}>{trainer.name}</Title>
              <div className="trainer-specialty">
                {trainer.specialty.split(', ').map((spec, index) => (
                  <Tag color="green" key={index}>{spec}</Tag>
                ))}
              </div>
              <div className="trainer-rating">
                <Rate disabled defaultValue={trainer.rating} allowHalf />
                <Text style={{ marginLeft: 8 }}>{trainer.rating}/5</Text>
              </div>
              <Paragraph className="trainer-experience">
                <Text strong>Опыт работы:</Text> {trainer.experience}
              </Paragraph>
              {user && user.role === 'client' && (
                <Space>
                  <Button 
                    type="primary" 
                    icon={<MessageOutlined />}
                    onClick={() => navigate('/account')}
                  >
                    Написать тренеру
                  </Button>
                </Space>
              )}
            </Col>
          </Row>
        </Card>
        
        <Row gutter={[24, 24]} className="trainer-content">
          <Col xs={24} lg={16}>
            <Card className="about-card">
              <Title level={4}>О тренере</Title>
              <Paragraph>{trainer.fullBio || trainer.about}</Paragraph>
              
              <Divider />
              
              <Title level={4}>Образование</Title>
              <Paragraph>{trainer.education}</Paragraph>
              
              <Divider />
              
              <Title level={4}>Достижения</Title>
              <List
                dataSource={trainer.achievements}
                renderItem={item => (
                  <List.Item>
                    <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />
                    <Text>{item}</Text>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card className="services-card">
              <Title level={4}>Услуги</Title>
              <List
                dataSource={trainer.services}
                renderItem={service => (
                  <List.Item>
                    <List.Item.Meta
                      title={service.name}
                      description={`${service.price} ₽`}
                    />
                    {user && user.role === 'client' && (
                      <Button size="small">Записаться</Button>
                    )}
                  </List.Item>
                )}
              />
            </Card>
            
            <Card className="contact-card" style={{ marginTop: 16 }}>
              <Title level={4}>Контакты</Title>
              <Space direction="vertical">
                <Text>
                  <MailOutlined style={{ marginRight: 8 }} />
                  {trainer.contacts.split(', ')[0].replace('Email: ', '')}
                </Text>
                <Text>
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {trainer.contacts.split(', ')[1].replace('Телефон: ', '')}
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TrainerDetailsPage; 