import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Card, Tabs, Button, Table, Form, Input, InputNumber, DatePicker, 
  Select, Space, Modal, Tag, Collapse, Divider, List, Row, Col } from 'antd'
import { Line } from '@ant-design/charts'
import { PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined, SaveOutlined,
  FileTextOutlined, CalendarOutlined, HistoryOutlined, LineChartOutlined } from '@ant-design/icons'
import './ClientDetailsPage.scss'
import './ClientChat.scss'
import dayjs, { Dayjs } from 'dayjs'
import ClientChat from './ClientChat'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Panel } = Collapse
const { TextArea } = Input

interface Training {
  type: string
  date: string
  progress: number
}

interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight: number
  notes?: string
}

interface WorkoutSession {
  id: string
  date: string
  title: string
  exercises: Exercise[]
  notes?: string
}

interface BodyMeasurement {
  date: string
  weight: number
  chest?: number
  waist?: number
  hips?: number
  thighs?: number
  arms?: number
  shoulders?: number
  neck?: number
  calves?: number
}

interface Client {
  id: number
  name: string
  age: number
  height: number
  weight: number
  trainings: Training[]
  workouts?: WorkoutSession[]
  bodyMeasurements?: BodyMeasurement[]
  notes?: string[]
  goals?: string
  medicalInfo?: string
  contactInfo?: string
  dietInfo?: string
}

interface ClientDetailsPageProps {
  user: {
    name: string
    role: 'client' | 'trainer'
  } | null
}

// Пример данных клиентов
const mockClients: Client[] = [
  {
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
        notes: 'Клиент отметил усталость к концу тренировки'
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
      'Клиент очень мотивирован, хочет улучшить силовые показатели',
      'Есть небольшие проблемы с правым коленом. Избегать чрезмерной нагрузки',
      'Предпочитает тренировки во второй половине дня'
    ],
    goals: 'Снижение веса до 75 кг, увеличение мышечной массы, улучшение осанки',
    medicalInfo: 'Нет серьезных противопоказаний. Незначительное напряжение в правом колене',
    contactInfo: 'Телефон: +7 (123) 456-78-90, Email: ivan.petrov@mail.ru',
    dietInfo: 'Придерживается высокобелковой диеты. 5 приемов пищи в день'
  },
  {
    id: 2,
    name: 'Мария Сидорова',
    age: 32,
    height: 165,
    weight: 62,
    trainings: [
      { type: 'Йога', date: '2024-06-09', progress: 50 },
      { type: 'Йога', date: '2024-06-13', progress: 65 },
      { type: 'Йога', date: '2024-06-16', progress: 75 },
    ],
    workouts: [],
    bodyMeasurements: [],
    notes: [],
    goals: 'Улучшение гибкости и выносливости',
    contactInfo: 'Телефон: +7 (987) 654-32-10'
  },
  {
    id: 3,
    name: 'Александр Иванов',
    age: 40,
    height: 175,
    weight: 85,
    trainings: [
      { type: 'Бокс', date: '2024-06-11', progress: 55 },
      { type: 'Бокс', date: '2024-06-14', progress: 60 },
      { type: 'Бокс', date: '2024-06-17', progress: 68 },
    ],
    workouts: [],
    bodyMeasurements: [],
    notes: [],
    goals: 'Улучшить технику бокса, снизить вес'
  }
]

interface WorkoutFormValues {
  title: string;
  date: string | Dayjs;
  notes?: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
    id?: string;
  }[];
}

const ClientDetailsPage = ({ user }: ClientDetailsPageProps) => {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<Client | null>(null)
  const [newNote, setNewNote] = useState('')
  const [isWorkoutModalVisible, setIsWorkoutModalVisible] = useState(false)
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession | null>(null)
  const [isMeasurementModalVisible, setIsMeasurementModalVisible] = useState(false)
  const [currentMeasurement, setCurrentMeasurement] = useState<BodyMeasurement | null>(null)
  const [workoutForm] = Form.useForm()
  const [measurementForm] = Form.useForm()
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [editInfoForm] = Form.useForm()

  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API
    const foundClient = mockClients.find(c => c.id === Number(clientId))
    if (foundClient) {
      if (!foundClient.workouts) foundClient.workouts = []
      if (!foundClient.bodyMeasurements) foundClient.bodyMeasurements = []
      if (!foundClient.notes) foundClient.notes = []
      setClient(foundClient)
    } else {
      navigate('/account') // Если клиент не найден
    }
  }, [clientId, navigate])

  useEffect(() => {
    // Проверка доступа (только для тренеров)
    if (user && user.role !== 'trainer') {
      navigate('/account')
    }
  }, [user, navigate])

  if (!client) {
    return <div className="loading">Загрузка...</div>
  }

  // Конфигурация для графика прогресса
  const chartData = client.trainings
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(t => ({ date: t.date, progress: t.progress, type: t.type }))

  const chartConfig = {
    data: chartData,
    xField: 'date',
    yField: 'progress',
    seriesField: 'type',
    point: { size: 5, shape: 'diamond' },
    color: ['#56ab2f'],
    xAxis: { title: { text: 'Дата' } },
    yAxis: { title: { text: 'Прогресс' }, min: 0, max: 100 },
    height: 300,
    smooth: true,
    tooltip: { showMarkers: true },
  }

  // Добавление заметки
  const addNote = () => {
    if (!newNote.trim()) return
    
    const updatedClient = {
      ...client,
      notes: [...client.notes!, newNote],
    }
    setClient(updatedClient)
    setNewNote('')
    // В реальном приложении здесь был бы запрос к API для сохранения заметки
  }

  // Функции для работы с тренировками
  const showWorkoutModal = (workout: WorkoutSession | null = null) => {
    setCurrentWorkout(workout)
    workoutForm.resetFields()
    
    if (workout) {
      workoutForm.setFieldsValue({
        title: workout.title,
        date: dayjs(workout.date),
        notes: workout.notes,
        exercises: workout.exercises
      })
    }
    
    setIsWorkoutModalVisible(true)
  }

  const handleWorkoutSave = (values: WorkoutFormValues) => {
    let dateStr: string
    if (dayjs.isDayjs(values.date)) {
      dateStr = (values.date as Dayjs).format('YYYY-MM-DD')
    } else if (typeof values.date === 'string') {
      dateStr = values.date
    } else {
      dateStr = ''
    }
    const newWorkout: WorkoutSession = {
      id: currentWorkout?.id || `workout-${Date.now()}`,
      title: values.title,
      date: dateStr,
      notes: values.notes,
      exercises: values.exercises.map((e, index: number) => ({
        ...e,
        id: currentWorkout?.exercises[index]?.id || `exercise-${Date.now()}-${index}`
      }))
    }

    let updatedWorkouts: WorkoutSession[]
    
    if (currentWorkout) {
      // Обновление существующей тренировки
      updatedWorkouts = client.workouts!.map(w => 
        w.id === currentWorkout.id ? newWorkout : w
      )
    } else {
      // Добавление новой тренировки
      updatedWorkouts = [...client.workouts!, newWorkout]
    }
    
    const updatedClient = {
      ...client,
      workouts: updatedWorkouts
    }
    
    setClient(updatedClient)
    setIsWorkoutModalVisible(false)
    // В реальном приложении здесь был бы запрос к API для сохранения тренировки
  }

  const copyWorkout = (workout: WorkoutSession) => {
    const copiedWorkout: WorkoutSession = {
      ...workout,
      id: `workout-${Date.now()}`,
      title: `${workout.title} (копия)`,
      exercises: workout.exercises.map(e => ({
        ...e,
        id: `exercise-${Date.now()}-${e.id}`
      }))
    }
    
    const updatedClient = {
      ...client,
      workouts: [...client.workouts!, copiedWorkout]
    }
    
    setClient(updatedClient)
    // В реальном приложении здесь был бы запрос к API для сохранения копии тренировки
  }

  const deleteWorkout = (workoutId: string) => {
    setTimeout(() => {
      const updatedClient = {
        ...client,
        workouts: client.workouts!.filter(w => w.id !== workoutId)
      }
      setClient(updatedClient)
    }, 0)
  }

  // Функции для работы с замерами тела
  const showMeasurementModal = (measurement: BodyMeasurement | null = null) => {
    setCurrentMeasurement(measurement)
    measurementForm.resetFields()
    
    if (measurement) {
      const formattedMeasurement = {
        ...measurement,
        date: dayjs(measurement.date)
      }
      
      measurementForm.setFieldsValue(formattedMeasurement)
    }
    
    setIsMeasurementModalVisible(true)
  }

  const handleMeasurementSave = (values: BodyMeasurement) => {
    let updatedMeasurements: BodyMeasurement[]
    
    if (currentMeasurement) {
      // Обновление существующего замера
      updatedMeasurements = client.bodyMeasurements!.map(m => 
        m.date === currentMeasurement.date ? values : m
      )
    } else {
      // Добавление нового замера
      updatedMeasurements = [...client.bodyMeasurements!, values]
    }
    
    const updatedClient = {
      ...client,
      bodyMeasurements: updatedMeasurements
    }
    
    setClient(updatedClient)
    setIsMeasurementModalVisible(false)
    // В реальном приложении здесь был бы запрос к API для сохранения замеров
  }

  const deleteMeasurement = (date: string) => {
    setTimeout(() => {
      const updatedClient = {
        ...client,
        bodyMeasurements: client.bodyMeasurements!.filter(m => m.date !== date)
      }
      setClient(updatedClient)
    }, 0)
  }

  // Функции для редактирования общей информации
  const startEditingInfo = () => {
    editInfoForm.setFieldsValue({
      goals: client.goals || '',
      contactInfo: client.contactInfo || '',
      medicalInfo: client.medicalInfo || '',
      dietInfo: client.dietInfo || ''
    })
    setIsEditingInfo(true)
  }
  
  const saveClientInfo = (values: { goals: string; contactInfo: string; medicalInfo: string; dietInfo: string }) => {
    const updatedClient = {
      ...client,
      ...values
    }
    setClient(updatedClient)
    setIsEditingInfo(false)
    // В реальном приложении здесь был бы запрос к API для сохранения информации
  }

  return (
    <div className="client-details">
      <div className="client-details-header">
        <Button onClick={() => navigate('/account')} className="back-button">
          Назад к списку клиентов
        </Button>
        <Title level={2}>{client.name}</Title>
        <div className="client-basic-info">
          <Tag color="blue">Возраст: {client.age} лет</Tag>
          <Tag color="blue">Рост: {client.height} см</Tag>
          <Tag color="blue">Вес: {client.weight} кг</Tag>
        </div>
      </div>
      
      <div className="client-details-content">
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><FileTextOutlined /> Общая информация</span>} key="1">
            {isEditingInfo ? (
              <Form
                form={editInfoForm}
                layout="vertical"
                onFinish={saveClientInfo}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="goals"
                      label="Цели"
                    >
                      <TextArea 
                        rows={4} 
                        placeholder="Введите цели клиента"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="contactInfo"
                      label="Контактная информация"
                    >
                      <TextArea 
                        rows={4} 
                        placeholder="Введите контактную информацию"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="medicalInfo"
                      label="Медицинская информация"
                    >
                      <TextArea 
                        rows={4} 
                        placeholder="Введите медицинскую информацию"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="dietInfo"
                      label="Информация о питании"
                    >
                      <TextArea 
                        rows={4} 
                        placeholder="Введите информацию о питании"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                  Сохранить
                </Button>
                <Button onClick={() => setIsEditingInfo(false)}>
                  Отмена
                </Button>
              </Form>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={startEditingInfo}
                    className="action-icon"
                  >
                    Редактировать информацию
                  </Button>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Card title="Цели" className="info-card">
                      <Paragraph>{client.goals || "Не указаны"}</Paragraph>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Контактная информация" className="info-card">
                      <Paragraph>{client.contactInfo || "Не указана"}</Paragraph>
                    </Card>
                  </Col>
                </Row>
                <Row gutter={24} style={{ marginTop: '16px' }}>
                  <Col span={12}>
                    <Card title="Медицинская информация" className="info-card">
                      <Paragraph>{client.medicalInfo || "Не указана"}</Paragraph>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Информация о питании" className="info-card">
                      <Paragraph>{client.dietInfo || "Не указана"}</Paragraph>
                    </Card>
                  </Col>
                </Row>

                <Card title="Прогресс клиента" className="chart-card" style={{ marginTop: '16px' }}>
                  <Line {...chartConfig} />
                </Card>
              </>
            )}
          </TabPane>
          
          <TabPane tab={<span><CalendarOutlined /> Тренировки</span>} key="2">
            <div className="action-bar">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => showWorkoutModal()}
                className="action-icon"
              >
                Добавить тренировку
              </Button>
            </div>
            
            {client.workouts && client.workouts.length > 0 ? (
              <Collapse accordion={false} className="workouts-list">
                {client.workouts
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(workout => (
                    <Panel 
                      key={workout.id} 
                      header={
                        <div className="workout-header">
                          <span className="workout-date">{new Date(workout.date).toLocaleDateString()}</span>
                          <span className="workout-title">{workout.title}</span>
                        </div>
                      }
                      extra={
                        <Space>
                          <Button 
                            icon={<EditOutlined />} 
                            size="small"
                            className="action-icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              showWorkoutModal(workout);
                            }}
                          />
                          <Button 
                            icon={<CopyOutlined />} 
                            size="small"
                            className="action-icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              copyWorkout(workout);
                            }}
                          />
                          <Button 
                            icon={<DeleteOutlined />} 
                            size="small"
                            danger
                            className="action-icon delete-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteWorkout(workout.id);
                            }}
                          />
                        </Space>
                      }
                    >
                      <Table 
                        dataSource={workout.exercises}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        columns={[
                          {
                            title: 'Упражнение',
                            dataIndex: 'name',
                            key: 'name',
                          },
                          {
                            title: 'Подходы',
                            dataIndex: 'sets',
                            key: 'sets',
                            width: 100,
                          },
                          {
                            title: 'Повторения',
                            dataIndex: 'reps',
                            key: 'reps',
                            width: 100,
                          },
                          {
                            title: 'Вес (кг)',
                            dataIndex: 'weight',
                            key: 'weight',
                            width: 100,
                            render: (weight) => weight > 0 ? weight : 'Без веса'
                          },
                        ]}
                      />
                      
                      {workout.notes && (
                        <div className="workout-notes">
                          <Divider orientation="left">Заметки к тренировке</Divider>
                          <Paragraph>{workout.notes}</Paragraph>
                        </div>
                      )}
                    </Panel>
                  ))
                }
              </Collapse>
            ) : (
              <div className="empty-state">
                <Text type="secondary">У клиента пока нет тренировок</Text>
              </div>
            )}
          </TabPane>
          
          <TabPane tab={<span><HistoryOutlined /> Замеры тела</span>} key="3">
            <div className="action-bar">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => showMeasurementModal()}
                className="action-icon"
              >
                Добавить замер
              </Button>
            </div>
            
            {client.bodyMeasurements && client.bodyMeasurements.length > 0 ? (
              <Table 
                className="measurements-table"
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
                    width: 100,
                    fixed: 'left'
                  },
                  {
                    title: 'Вес (кг)',
                    dataIndex: 'weight',
                    key: 'weight',
                    width: 100
                  },
                  {
                    title: 'Грудь (см)',
                    dataIndex: 'chest',
                    key: 'chest',
                    width: 100
                  },
                  {
                    title: 'Талия (см)',
                    dataIndex: 'waist',
                    key: 'waist',
                    width: 100
                  },
                  {
                    title: 'Бедра (см)',
                    dataIndex: 'hips',
                    key: 'hips',
                    width: 100
                  },
                  {
                    title: 'Руки (см)',
                    dataIndex: 'arms',
                    key: 'arms',
                    width: 100
                  },
                  {
                    title: 'Ноги (см)',
                    dataIndex: 'thighs',
                    key: 'thighs',
                    width: 100
                  },
                  {
                    title: 'Плечи (см)',
                    dataIndex: 'shoulders',
                    key: 'shoulders',
                    width: 100
                  },
                  {
                    title: 'Шея (см)',
                    dataIndex: 'neck',
                    key: 'neck',
                    width: 100
                  },
                  {
                    title: 'Голени (см)',
                    dataIndex: 'calves',
                    key: 'calves',
                    width: 100
                  },
                  {
                    title: '',
                    key: 'actions',
                    width: 110,
                    className: 'actions-column',
                    fixed: 'right',
                    render: (_, record) => (
                      <Space>
                        <Button 
                          icon={<EditOutlined />} 
                          size="small"
                          className="action-icon" 
                          onClick={() => showMeasurementModal(record)}
                        />
                        <Button 
                          icon={<DeleteOutlined />} 
                          size="small"
                          danger
                          className="action-icon delete-icon"
                          onClick={() => deleteMeasurement(record.date)}
                        />
                      </Space>
                    )
                  }
                ]}
                scroll={{ x: 1100 }}
              />
            ) : (
              <div className="empty-state">
                <Text type="secondary">У клиента пока нет замеров тела</Text>
              </div>
            )}
          </TabPane>
          
          <TabPane tab={<span><LineChartOutlined /> Динамика</span>} key="4">
            {client.bodyMeasurements && client.bodyMeasurements.length > 0 ? (
              <div className="charts-container">
                <Card title="Динамика веса" className="chart-card">
                  <Line 
                    data={client.bodyMeasurements.map(m => ({ date: m.date, value: m.weight, metric: 'Вес' }))}
                    xField="date"
                    yField="value"
                    seriesField="metric"
                    smooth
                  />
                </Card>
                <Card title="Динамика объемов тела" className="chart-card">
                  <Line 
                    data={client.bodyMeasurements.flatMap(m => [
                      { date: m.date, value: m.chest, metric: 'Грудь' },
                      { date: m.date, value: m.waist, metric: 'Талия' },
                      { date: m.date, value: m.hips, metric: 'Бедра' },
                    ].filter(item => item.value !== undefined))}
                    xField="date"
                    yField="value"
                    seriesField="metric"
                    smooth
                  />
                </Card>
              </div>
            ) : (
              <div className="empty-state">
                <Text type="secondary">Недостаточно данных для отображения динамики</Text>
              </div>
            )}
          </TabPane>
          
          <TabPane tab={<span><FileTextOutlined /> Заметки</span>} key="5">
            <div className="notes-container">
              <Card className="add-note-card">
                <Form.Item label="Добавить заметку">
                  <TextArea 
                    rows={3} 
                    value={newNote} 
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Введите текст заметки"
                  />
                </Form.Item>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />}
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="action-icon"
                >
                  Сохранить
                </Button>
              </Card>
              
              {client.notes && client.notes.length > 0 ? (
                <List
                  className="notes-list"
                  itemLayout="horizontal"
                  dataSource={client.notes}
                  renderItem={(note, index) => (
                    <List.Item>
                      <List.Item.Meta
                        title={`Заметка ${index + 1}`}
                        description={note}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div className="empty-state">
                  <Text type="secondary">У клиента пока нет заметок</Text>
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
      
      {/* Модальное окно для создания/редактирования тренировки */}
      <Modal
        title={currentWorkout ? "Редактирование тренировки" : "Новая тренировка"}
        open={isWorkoutModalVisible}
        onCancel={() => setIsWorkoutModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={workoutForm}
          layout="vertical"
          onFinish={handleWorkoutSave}
          initialValues={{ exercises: [{ name: '', sets: 3, reps: 10, weight: 0 }] }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Название тренировки"
                rules={[{ required: true, message: 'Введите название тренировки' }]}
              >
                <Input placeholder="Например: Тренировка верхней части тела" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="date"
                label="Дата"
                rules={[{ required: true, message: 'Выберите дату' }]}
              >
                <DatePicker placeholder="Выберите дату" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          {!currentWorkout && client.workouts && client.workouts.length > 0 && (
            <Form.Item label="Копировать из тренировки">
              <Select
                placeholder="Выберите тренировку для копирования (опционально)"
                style={{ width: '100%' }}
                onChange={(value) => {
                  const selectedWorkout = client.workouts!.find(w => w.id === value)
                  if (selectedWorkout) {
                    workoutForm.setFieldsValue({
                      title: `${selectedWorkout.title} (копия)`,
                      notes: selectedWorkout.notes,
                      exercises: selectedWorkout.exercises.map(e => ({
                        name: e.name,
                        sets: e.sets,
                        reps: e.reps,
                        weight: e.weight
                      }))
                    })
                  }
                }}
                allowClear
              >
                {client.workouts.map(w => (
                  <Select.Option key={w.id} value={w.id}>
                    {w.title} ({new Date(w.date).toLocaleDateString()})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          
          <Form.List name="exercises">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      style={{ flex: 2 }}
                      rules={[{ required: true, message: 'Введите название упражнения' }]}
                    >
                      <Input placeholder="Название упражнения" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'sets']}
                      style={{ flex: 1 }}
                      rules={[{ required: true, message: 'Укажите количество подходов' }]}
                    >
                      <InputNumber placeholder="Подходы" min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'reps']}
                      style={{ flex: 1 }}
                      rules={[{ required: true, message: 'Укажите количество повторений' }]}
                    >
                      <InputNumber placeholder="Повторения" min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'weight']}
                      style={{ flex: 1 }}
                      rules={[{ required: true, message: 'Укажите вес' }]}
                    >
                      <InputNumber placeholder="Вес (кг)" min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Button 
                      danger 
                      onClick={() => remove(name)} 
                      icon={<DeleteOutlined />} 
                      disabled={fields.length === 1}
                    />
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Добавить упражнение
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          
          <Form.Item name="notes" label="Заметки к тренировке">
            <TextArea rows={3} placeholder="Заметки, комментарии, наблюдения..." />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentWorkout ? "Сохранить изменения" : "Создать тренировку"}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setIsWorkoutModalVisible(false)}>
              Отмена
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Модальное окно для создания/редактирования замеров тела */}
      <Modal
        title={currentMeasurement ? "Редактирование замеров" : "Новые замеры"}
        open={isMeasurementModalVisible}
        onCancel={() => setIsMeasurementModalVisible(false)}
        footer={null}
      >
        <Form
          form={measurementForm}
          layout="vertical"
          onFinish={handleMeasurementSave}
        >
          <Form.Item
            name="date"
            label="Дата"
            rules={[{ required: true, message: 'Выберите дату замеров' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="weight"
            label="Вес (кг)"
            rules={[{ required: true, message: 'Введите вес' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="chest" label="Обхват груди (см)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="waist" label="Обхват талии (см)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="hips" label="Обхват бедер (см)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="thighs" label="Обхват бедра (см)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="arms" label="Обхват рук (см)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="shoulders" label="Обхват плеч (см)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="neck" label="Обхват шеи (см)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="calves" label="Обхват голени (см)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentMeasurement ? "Сохранить изменения" : "Сохранить замеры"}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setIsMeasurementModalVisible(false)}>
              Отмена
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ClientChat clientName={client.name} />
    </div>
  )
}

export default ClientDetailsPage 