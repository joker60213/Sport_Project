import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Typography, Card, Tabs, Button, Table, Avatar, Tag, 
  Collapse, List, Row, Col, Progress, Divider, Space, Modal,
  Input, Form, Tooltip
} from 'antd'
import { 
  UserOutlined, CalendarOutlined, LineChartOutlined, FileTextOutlined, 
  TeamOutlined, MessageOutlined, InfoCircleOutlined, DashboardOutlined,
  LogoutOutlined, RightOutlined, EditOutlined, SaveOutlined, 
  CloseOutlined, CommentOutlined, MinusCircleOutlined, PlusOutlined
} from '@ant-design/icons'
import './ClientAccountPage.scss'
import ClientAccountChat from './ClientAccountChat'
import { 
  Client, Trainer, ClientAccountPageProps
} from '../../types'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Panel } = Collapse
const { TextArea } = Input

// Моковые данные о тренерах для демонстрации
const mockTrainers: Trainer[] = [
  {
    id: 1,
    name: 'Алексей Тренер',
    specialty: 'Фитнес, Силовые тренировки',
    img: 'https://xsgames.co/randomusers/assets/avatars/male/8.jpg',
    rating: 4.8,
    experience: '5 лет',
    about: 'Профессиональный фитнес-тренер с сертификацией NASM. Специализируюсь на силовых тренировках и функциональном тренинге.',
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
    contacts: 'Email: yoga@example.com, Телефон: +7 (999) 234-56-78'
  }
];

// Пример данных клиентов
const mockClient: Client = {
  id: 1,
  name: 'Иван Петров',
  age: 28,
  height: 180,
  weight: 78,
  trainings: [
    { type: 'Фитнес', date: '2024-06-10', progress: 60 },
    { type: 'Фитнес', date: '2024-06-12', progress: 70 },
    { type: 'Фитнес', date: '2024-06-15', progress: 80 },
  ],
  workouts: [
    {
      id: '1',
      date: '2024-06-10',
      title: 'Тренировка верхней части тела',
      exercises: [
        { id: '1-1', name: 'Жим штанги лежа', sets: 4, reps: 10, weight: 60 },
        { id: '1-2', name: 'Тяга верхнего блока', sets: 3, reps: 12, weight: 50 },
        { id: '1-3', name: 'Разведение гантелей в стороны', sets: 3, reps: 15, weight: 12 },
      ],
      notes: 'Обратить внимание на технику выполнения жима лежа'
    },
    {
      id: '2',
      date: '2024-06-12',
      title: 'Тренировка нижней части тела',
      exercises: [
        { id: '2-1', name: 'Приседания со штангой', sets: 4, reps: 10, weight: 70 },
        { id: '2-2', name: 'Разгибание ног в тренажере', sets: 3, reps: 12, weight: 40 },
        { id: '2-3', name: 'Жим ногами в тренажере', sets: 3, reps: 15, weight: 120 },
      ]
    },
    {
      id: '3',
      date: '2024-06-15',
      title: 'Общая тренировка',
      exercises: [
        { id: '3-1', name: 'Подтягивания', sets: 4, reps: 8, weight: 0 },
        { id: '3-2', name: 'Отжимания на брусьях', sets: 4, reps: 10, weight: 0 },
        { id: '3-3', name: 'Выпады с гантелями', sets: 3, reps: 12, weight: 16 },
      ]
    }
  ],
  bodyMeasurements: [
    {
      date: '2024-06-01',
      weight: 80,
      chest: 95,
      waist: 85,
      hips: 100,
      thighs: 60,
      arms: 35,
      shoulders: 120,
      neck: 40,
      calves: 38
    },
    {
      date: '2024-06-15',
      weight: 78,
      chest: 96,
      waist: 83,
      hips: 99,
      thighs: 61,
      arms: 36,
      shoulders: 121,
      neck: 40,
      calves: 38
    }
  ],
  notes: [
    'План питания: Увеличить количество белка',
    'Не забывать про растяжку после тренировок',
    'Тренер рекомендовал уделить внимание мышцам спины'
  ],
  goals: 'Снижение веса до 75 кг, увеличение мышечной массы, улучшение осанки',
  medicalInfo: 'Нет серьезных противопоказаний. Незначительное напряжение в правом колене',
  contactInfo: 'Телефон: +7 (123) 456-78-90, Email: ivan.petrov@mail.ru',
  dietInfo: 'Придерживается высокобелковой диеты. 5 приемов пищи в день'
};

const ClientAccountPage = ({ user, setUser, isAuthLoading }: ClientAccountPageProps) => {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [activeChats, setActiveChats] = useState<Trainer[]>([]);
  const [currentChatIndex, setCurrentChatIndex] = useState<number>(-1);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  
  // Editing states
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [isEditingDiet, setIsEditingDiet] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  
  // Temporary values for editing
  const [editedGoals, setEditedGoals] = useState('');
  const [editedNotes, setEditedNotes] = useState<string[]>([]);
  const [editedMedical, setEditedMedical] = useState('');
  const [editedDiet, setEditedDiet] = useState('');
  const [editedContact, setEditedContact] = useState('');

  useEffect(() => {
    // В реальном приложении здесь будет загрузка данных с сервера
    if (user === null && !isAuthLoading) {
      navigate('/login');
    } else {
      // Загрузка данных клиента
      setClient(mockClient);
      setTrainers(mockTrainers);
    }
  }, [user, isAuthLoading, navigate]);

  useEffect(() => {
    if (client) {
      // Initialize editing states
      setEditedGoals(client.goals || '');
      setEditedNotes(client.notes || []);
      setEditedMedical(client.medicalInfo || '');
      setEditedDiet(client.dietInfo || '');
      setEditedContact(client.contactInfo || '');
    }
  }, [client]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const toggleChat = (trainer: Trainer) => {
    // Check if chat with this trainer already exists
    const existingIndex = activeChats.findIndex(t => t.id === trainer.id);
    
    if (existingIndex >= 0) {
      // Chat exists, just switch to it
      setCurrentChatIndex(existingIndex);
      setIsChatCollapsed(false);
    } else {
      // Add new chat
      setActiveChats([...activeChats, trainer]);
      setCurrentChatIndex(activeChats.length);
      setIsChatCollapsed(false);
    }
  };

  const collapseChat = () => {
    setIsChatCollapsed(true);
  };

  const expandChat = () => {
    setIsChatCollapsed(false);
  };

  const closeChat = (index: number) => {
    const newChats = [...activeChats];
    newChats.splice(index, 1);
    setActiveChats(newChats);
    
    // Update current chat index
    if (index === currentChatIndex) {
      if (newChats.length > 0) {
        setCurrentChatIndex(Math.min(index, newChats.length - 1));
      } else {
        setCurrentChatIndex(-1);
      }
    } else if (index < currentChatIndex) {
      setCurrentChatIndex(currentChatIndex - 1);
    }
  };

  const showTrainerDetails = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsTrainerModalOpen(true);
  };

  // Handle saving edited content
  const saveGoals = () => {
    if (client) {
      setClient({...client, goals: editedGoals});
      setIsEditingGoals(false);
    }
  };

  const saveNotes = () => {
    if (client) {
      setClient({...client, notes: editedNotes});
      setIsEditingNotes(false);
    }
  };

  const saveMedical = () => {
    if (client) {
      setClient({...client, medicalInfo: editedMedical});
      setIsEditingMedical(false);
    }
  };

  const saveDiet = () => {
    if (client) {
      setClient({...client, dietInfo: editedDiet});
      setIsEditingDiet(false);
    }
  };

  const saveContact = () => {
    if (client) {
      setClient({...client, contactInfo: editedContact});
      setIsEditingContact(false);
    }
  };

  // Handle note modifications
  const updateNote = (index: number, value: string) => {
    const newNotes = [...editedNotes];
    newNotes[index] = value;
    setEditedNotes(newNotes);
  };

  const addNote = () => {
    setEditedNotes([...editedNotes, '']);
  };

  const removeNote = (index: number) => {
    const newNotes = [...editedNotes];
    newNotes.splice(index, 1);
    setEditedNotes(newNotes);
  };

  if (!client) {
    return (
      <div className="client-account-loading">
        <Text>Загрузка данных...</Text>
      </div>
    );
  }

  // Вычисляем прогресс
  const averageProgress = client.trainings.length > 0
    ? client.trainings.reduce((sum, training) => sum + training.progress, 0) / client.trainings.length
    : 0;

  // Получаем последние измерения
  const latestMeasurement = client.bodyMeasurements && client.bodyMeasurements.length > 0
    ? client.bodyMeasurements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  // Получаем ближайшую тренировку
  const upcomingWorkout = client.workouts && client.workouts.length > 0
    ? client.workouts
      .filter(workout => new Date(workout.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
    : null;

  return (
    <div className="client-account">
      <div className="client-account-header">
        <div className="client-profile">
          <Avatar
            size={80}
            icon={<UserOutlined />}
            className="client-avatar"
          />
          <div className="client-info">
            <Title level={3}>{client.name}</Title>
            <div className="client-stats">
              <Tag color="blue">Возраст: {client.age} лет</Tag>
              <Tag color="blue">Рост: {client.height} см</Tag>
              <Tag color="blue">Вес: {latestMeasurement?.weight || client.weight} кг</Tag>
            </div>
          </div>
        </div>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="logout-button"
        >
          Выйти
        </Button>
      </div>

      <div className="client-account-content">
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><DashboardOutlined /> Общая информация</span>} key="1">
            <Row gutter={[16, 16]} className="dashboard-row">
              <Col xs={24} md={12} lg={8}>
                <Card title="Общий прогресс" className="dashboard-card">
                  <Progress type="circle" percent={Math.round(averageProgress)} />
                  <Paragraph className="card-help-text">
                    Общий прогресс тренировок на основе ваших занятий
                  </Paragraph>
                </Card>
              </Col>
              
              <Col xs={24} md={12} lg={8}>
                <Card title="Ближайшая тренировка" className="dashboard-card">
                  {upcomingWorkout ? (
                    <>
                      <Title level={4}>{upcomingWorkout.title}</Title>
                      <Text strong>Дата: {new Date(upcomingWorkout.date).toLocaleDateString()}</Text>
                      <Paragraph>{upcomingWorkout.exercises.length} упражнений</Paragraph>
                      <Button type="link" onClick={() => navigate('/#workouts')}>Подробнее</Button>
                    </>
                  ) : (
                    <Text>Нет запланированных тренировок</Text>
                  )}
                </Card>
              </Col>
              
              <Col xs={24} md={12} lg={8}>
                <Card 
                  title="Цели" 
                  className="dashboard-card"
                  extra={
                    isEditingGoals ? (
                      <Space className="card-controls">
                        <Button 
                          type="primary" 
                          icon={<SaveOutlined />} 
                          onClick={saveGoals}
                        >
                          Сохранить
                        </Button>
                        <Button 
                          icon={<CloseOutlined />} 
                          onClick={() => {
                            setIsEditingGoals(false);
                            setEditedGoals(client.goals || '');
                          }}
                        >
                          Отмена
                        </Button>
                      </Space>
                    ) : (
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => setIsEditingGoals(true)}
                        className="edit-button"
                      />
                    )
                  }
                >
                  {isEditingGoals ? (
                    <TextArea 
                      value={editedGoals}
                      onChange={e => setEditedGoals(e.target.value)}
                      rows={4}
                      placeholder="Укажите ваши цели тренировок"
                    />
                  ) : (
                    <Paragraph>{client.goals || "Не указаны"}</Paragraph>
                  )}
                </Card>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} className="dashboard-row">
              <Col xs={24} md={12}>
                <Card 
                  title="Мои тренеры" 
                  className="dashboard-card trainers-dashboard-card"
                >
                  <div className="trainers-grid">
                    {trainers.map(trainer => (
                      <div key={trainer.id} className="trainer-card-mini">
                        <div className="trainer-card-header">
                          <Avatar
                            src={trainer.img}
                            icon={!trainer.img && <UserOutlined />}
                            size={60}
                          />
                          <div className="trainer-card-info">
                            <Text strong>{trainer.name}</Text>
                            <Text type="secondary">{trainer.specialty.split(', ')[0]}</Text>
                          </div>
                        </div>
                        <div className="trainer-card-actions">
                          <Tooltip title="Написать">
                            <Button 
                              type="primary" 
                              icon={<MessageOutlined />} 
                              onClick={() => toggleChat(trainer)}
                              shape="circle"
                              size="small"
                            />
                          </Tooltip>
                          <Tooltip title="Подробнее">
                            <Button 
                              icon={<InfoCircleOutlined />} 
                              onClick={() => showTrainerDetails(trainer)}
                              shape="circle"
                              size="small"
                            />
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card 
                  title="Заметки" 
                  className="dashboard-card"
                  extra={
                    isEditingNotes ? (
                      <Space className="card-controls">
                        <Button 
                          type="primary" 
                          icon={<SaveOutlined />} 
                          onClick={saveNotes}
                        >
                          Сохранить
                        </Button>
                        <Button 
                          icon={<CloseOutlined />} 
                          onClick={() => {
                            setIsEditingNotes(false);
                            setEditedNotes(client.notes || []);
                          }}
                        >
                          Отмена
                        </Button>
                      </Space>
                    ) : (
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => setIsEditingNotes(true)}
                        className="edit-button"
                      />
                    )
                  }
                >
                  {isEditingNotes ? (
                    <div className="notes-editor">
                      <Form layout="vertical">
                        {editedNotes.map((note, index) => (
                          <Form.Item key={index}>
                            <Input
                              value={note}
                              onChange={(e) => updateNote(index, e.target.value)}
                              addonAfter={
                                <Button
                                  type="text"
                                  icon={<MinusCircleOutlined />}
                                  onClick={() => removeNote(index)}
                                  danger
                                />
                              }
                            />
                          </Form.Item>
                        ))}
                        <Button 
                          type="dashed" 
                          onClick={addNote} 
                          block 
                          icon={<PlusOutlined />}
                        >
                          Добавить заметку
                        </Button>
                      </Form>
                    </div>
                  ) : (
                    client.notes && client.notes.length > 0 ? (
                      <List
                        dataSource={client.notes}
                        renderItem={note => (
                          <List.Item>
                            <Text>{note}</Text>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Text>Нет заметок</Text>
                    )
                  )}
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab={<span><CalendarOutlined /> Тренировки</span>} key="2">
            <Card className="workouts-card">
              <Title level={4}>План тренировок</Title>
              <Collapse accordion className="workouts-list">
                {client.workouts && client.workouts.map(workout => (
                  <Panel
                    key={workout.id}
                    header={
                      <div className="workout-header">
                        <span className="workout-date">
                          {new Date(workout.date).toLocaleDateString()}
                        </span>
                        <span className="workout-title">{workout.title}</span>
                      </div>
                    }
                  >
                    <Table
                      dataSource={workout.exercises}
                      rowKey="id"
                      pagination={false}
                      columns={[
                        {
                          title: 'Упражнение',
                          dataIndex: 'name',
                          key: 'name',
                        },
                        {
                          title: 'Подходов',
                          dataIndex: 'sets',
                          key: 'sets',
                          width: 100,
                        },
                        {
                          title: 'Повторений',
                          dataIndex: 'reps',
                          key: 'reps',
                          width: 100,
                        },
                        {
                          title: 'Вес (кг)',
                          dataIndex: 'weight',
                          key: 'weight',
                          width: 100,
                        },
                      ]}
                    />
                    {workout.notes && (
                      <div className="workout-notes">
                        <Divider>Заметки</Divider>
                        <Paragraph>{workout.notes}</Paragraph>
                      </div>
                    )}
                  </Panel>
                ))}
              </Collapse>
            </Card>
          </TabPane>
          
          <TabPane tab={<span><LineChartOutlined /> Прогресс</span>} key="3">
            <Card className="progress-card">
              <Title level={4}>Замеры тела</Title>
              {client.bodyMeasurements && client.bodyMeasurements.length > 0 ? (
                <Table
                  dataSource={client.bodyMeasurements.slice().sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                  )}
                  rowKey="date"
                  columns={[
                    {
                      title: 'Дата',
                      dataIndex: 'date',
                      key: 'date',
                      render: (date) => new Date(date).toLocaleDateString(),
                    },
                    {
                      title: 'Вес (кг)',
                      dataIndex: 'weight',
                      key: 'weight',
                    },
                    {
                      title: 'Грудь (см)',
                      dataIndex: 'chest',
                      key: 'chest',
                    },
                    {
                      title: 'Талия (см)',
                      dataIndex: 'waist',
                      key: 'waist',
                    },
                    {
                      title: 'Бедра (см)',
                      dataIndex: 'hips',
                      key: 'hips',
                    },
                    {
                      title: 'Руки (см)',
                      dataIndex: 'arms',
                      key: 'arms',
                    },
                    {
                      title: 'Ноги (см)',
                      dataIndex: 'thighs',
                      key: 'thighs',
                    },
                  ]}
                  scroll={{ x: 800 }}
                />
              ) : (
                <Text>Нет данных о замерах</Text>
              )}
            </Card>
          </TabPane>
          
          <TabPane tab={<span><FileTextOutlined /> Информация</span>} key="4">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card 
                  title="Медицинская информация" 
                  className="info-card"
                  extra={
                    isEditingMedical ? (
                      <Space className="card-controls">
                        <Button 
                          type="primary" 
                          icon={<SaveOutlined />} 
                          onClick={saveMedical}
                        >
                          Сохранить
                        </Button>
                        <Button 
                          icon={<CloseOutlined />} 
                          onClick={() => {
                            setIsEditingMedical(false);
                            setEditedMedical(client.medicalInfo || '');
                          }}
                        >
                          Отмена
                        </Button>
                      </Space>
                    ) : (
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => setIsEditingMedical(true)}
                        className="edit-button"
                      />
                    )
                  }
                >
                  {isEditingMedical ? (
                    <TextArea 
                      value={editedMedical}
                      onChange={e => setEditedMedical(e.target.value)}
                      rows={4}
                      placeholder="Укажите вашу медицинскую информацию"
                    />
                  ) : (
                    <Paragraph>{client.medicalInfo || "Не указана"}</Paragraph>
                  )}
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card 
                  title="Диетические рекомендации" 
                  className="info-card"
                  extra={
                    isEditingDiet ? (
                      <Space className="card-controls">
                        <Button 
                          type="primary" 
                          icon={<SaveOutlined />} 
                          onClick={saveDiet}
                        >
                          Сохранить
                        </Button>
                        <Button 
                          icon={<CloseOutlined />} 
                          onClick={() => {
                            setIsEditingDiet(false);
                            setEditedDiet(client.dietInfo || '');
                          }}
                        >
                          Отмена
                        </Button>
                      </Space>
                    ) : (
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => setIsEditingDiet(true)}
                        className="edit-button"
                      />
                    )
                  }
                >
                  {isEditingDiet ? (
                    <TextArea 
                      value={editedDiet}
                      onChange={e => setEditedDiet(e.target.value)}
                      rows={4}
                      placeholder="Укажите диетические рекомендации"
                    />
                  ) : (
                    <Paragraph>{client.dietInfo || "Не указаны"}</Paragraph>
                  )}
                </Card>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24}>
                <Card 
                  title="Контактная информация" 
                  className="info-card"
                  extra={
                    isEditingContact ? (
                      <Space className="card-controls">
                        <Button 
                          type="primary" 
                          icon={<SaveOutlined />} 
                          onClick={saveContact}
                        >
                          Сохранить
                        </Button>
                        <Button 
                          icon={<CloseOutlined />} 
                          onClick={() => {
                            setIsEditingContact(false);
                            setEditedContact(client.contactInfo || '');
                          }}
                        >
                          Отмена
                        </Button>
                      </Space>
                    ) : (
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => setIsEditingContact(true)}
                        className="edit-button"
                      />
                    )
                  }
                >
                  {isEditingContact ? (
                    <TextArea 
                      value={editedContact}
                      onChange={e => setEditedContact(e.target.value)}
                      rows={3}
                      placeholder="Укажите вашу контактную информацию"
                    />
                  ) : (
                    <Paragraph>{client.contactInfo || "Не указана"}</Paragraph>
                  )}
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab={<span><TeamOutlined /> Тренеры</span>} key="5">
            <Card className="trainers-card">
              <List
                dataSource={trainers}
                renderItem={trainer => (
                  <List.Item>
                    <Card className="trainer-card">
                      <Row gutter={16}>
                        <Col xs={24} sm={6}>
                          <Avatar
                            src={trainer.img}
                            icon={!trainer.img && <UserOutlined />}
                            size={100}
                          />
                        </Col>
                        <Col xs={24} sm={18}>
                          <Title level={4}>{trainer.name}</Title>
                          <Text type="secondary">Специализация: {trainer.specialty}</Text>
                          <Paragraph>
                            <Text strong>Опыт работы:</Text> {trainer.experience}
                          </Paragraph>
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {trainer.about}
                          </Paragraph>
                          <Space>
                            <Button 
                              type="primary" 
                              icon={<MessageOutlined />}
                              onClick={() => toggleChat(trainer)}
                            >
                              Написать
                            </Button>
                            <Button 
                              icon={<InfoCircleOutlined />}
                              onClick={() => showTrainerDetails(trainer)}
                            >
                              Подробнее <RightOutlined />
                            </Button>
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          </TabPane>
        </Tabs>
      </div>
      
      {/* Чат с тренерами (коллапсируемый) */}
      {activeChats.length > 0 && (
        isChatCollapsed ? (
          <div className="chat-collapsed" onClick={expandChat}>
            <Button 
              type="primary" 
              icon={<CommentOutlined />}
              className="chat-expand-button"
            >
              Чаты ({activeChats.length})
            </Button>
          </div>
        ) : (
          <ClientAccountChat
            onClose={collapseChat}
            onCloseChat={() => closeChat(currentChatIndex)}
            activeChats={activeChats}
            currentChatIndex={currentChatIndex}
            setCurrentChatIndex={setCurrentChatIndex}
          />
        )
      )}

      {/* Модальное окно с подробной информацией о тренере */}
      <Modal
        title={selectedTrainer?.name}
        open={isTrainerModalOpen}
        onCancel={() => setIsTrainerModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsTrainerModalOpen(false)}>
            Закрыть
          </Button>,
          <Button 
            key="chat" 
            type="primary" 
            icon={<MessageOutlined />}
            onClick={() => {
              setIsTrainerModalOpen(false);
              if (selectedTrainer) toggleChat(selectedTrainer);
            }}
          >
            Написать
          </Button>
        ]}
        width={700}
      >
        {selectedTrainer && (
          <div className="trainer-details">
            <Row gutter={16} className="trainer-info-row">
              <Col xs={24} sm={8}>
                <Avatar
                  src={selectedTrainer.img}
                  icon={!selectedTrainer.img && <UserOutlined />}
                  size={150}
                />
              </Col>
              <Col xs={24} sm={16}>
                <Paragraph>
                  <Text strong>Специализация:</Text> {selectedTrainer.specialty}
                </Paragraph>
                <Paragraph>
                  <Text strong>Опыт работы:</Text> {selectedTrainer.experience}
                </Paragraph>
                <Paragraph>
                  <Text strong>Рейтинг:</Text> {selectedTrainer.rating} / 5
                </Paragraph>
                <Divider />
                <Paragraph>
                  <Text strong>О тренере:</Text>
                </Paragraph>
                <Paragraph>{selectedTrainer.about}</Paragraph>
                <Divider />
                <Paragraph>
                  <Text strong>Контакты:</Text>
                </Paragraph>
                <Paragraph>{selectedTrainer.contacts}</Paragraph>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClientAccountPage; 