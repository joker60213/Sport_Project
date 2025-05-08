import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Typography, Alert, Input, Select, Rate, message, Upload, Collapse } from 'antd'
import { UploadOutlined, PlusOutlined, DeleteOutlined, FileImageOutlined } from '@ant-design/icons'
import { Line } from '@ant-design/charts'
import './AccountPage.scss'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { Panel } = Collapse

interface Training {
  type: string
  date: string // ISO
  progress: number // для графика
}

interface Client {
  id: number
  name: string
  age: number
  height: number
  weight: number
  trainings: Training[]
}

interface Review {
  id: number
  author: string
  text: string
  rating: number
  date: string
  specialization?: string
  price?: number
}

interface Service {
  id: number
  name: string
  price: number
}

interface User {
  name: string
  role: 'client' | 'trainer'
  trial?: boolean
  specialty?: string
  about?: string
  img?: string
  rating?: number
  education?: string
  experience?: string
  extraInfo?: string
  services?: Service[]
  gallery?: string[]
  certificates?: string[]
  reviews?: Review[]
}

interface AccountPageProps {
  user: User | null
  setUser: (user: User | null) => void
  isAuthLoading?: boolean
}

const specialties = ['фитнес', 'йога', 'бокс', 'пилатес', 'стретчинг', 'танцы']

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
  },
]

// Фейковые отзывы для тренера
const fakeTrainerReviews: Review[] = [
  {
    id: 1001,
    author: 'Константин',
    text: '',
    rating: 4.5,
    date: '2024-01-12T10:00:00.000Z',
    specialization: 'Фитнес',
    price: 3000,
  },
  {
    id: 1002,
    author: 'Мария',
    text: '',
    rating: 5,
    date: '2024-02-05T15:00:00.000Z',
    specialization: 'Йога',
    price: 2500,
  },
]

const AccountPage = ({ user, setUser, isAuthLoading }: AccountPageProps) => {
  const navigate = useNavigate()
  const [editMode, setEditMode] = useState(false)
  const [profile, setProfile] = useState<User | null>(user)
  // В реальном проекте клиенты будут из API
  const [clients] = useState<Client[]>(mockClients)
  // Новые состояния для отзывов, услуг, галереи, сертификатов
  const [reviewForm, setReviewForm] = useState({ author: '', text: '', rating: 5, specialization: '', price: '' })
  const [serviceForm, setServiceForm] = useState({ name: '', price: '' })

  useEffect(() => {
    if (user === null && !isAuthLoading) {
      navigate('/login')
    } else if (user) {
      setProfile(user)
    }
  }, [user, isAuthLoading, navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const handleSave = () => {
    if (!profile) return
    localStorage.setItem('user', JSON.stringify(profile))
    setUser(profile)
    setEditMode(false)
    message.success('Профиль успешно сохранён!')
  }

  const handleChange = (field: keyof User, value: unknown) => {
    setProfile((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  const handleUpload = (info: { file: { status?: string; originFileObj?: File } }) => {
    if (info.file.status === 'done' || info.file.originFileObj) {
      const reader = new FileReader()
      reader.onload = (e) => {
        handleChange('img', e.target?.result as string)
      }
      if (info.file.originFileObj) {
        reader.readAsDataURL(info.file.originFileObj)
      }
    }
  }

  // --- ОТЗЫВЫ ---
  const handleAddReview = () => {
    if (!profile || !reviewForm.author || !reviewForm.text) return
    const newReview: Review = {
      id: Date.now(),
      author: reviewForm.author,
      text: reviewForm.text,
      rating: reviewForm.rating,
      date: new Date().toISOString(),
      specialization: reviewForm.specialization,
      price: Number(reviewForm.price),
    }
    const updated = { ...profile, reviews: [newReview, ...(profile.reviews || [])] }
    setProfile(updated)
    setReviewForm({ author: '', text: '', rating: 5, specialization: '', price: '' })
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
  }

  // --- УСЛУГИ ---
  const handleAddService = () => {
    if (!profile || !serviceForm.name || !serviceForm.price) return
    const newService: Service = {
      id: Date.now(),
      name: serviceForm.name,
      price: Number(serviceForm.price),
    }
    const updated = { ...profile, services: [...(profile.services || []), newService] }
    setProfile(updated)
    setServiceForm({ name: '', price: '' })
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
  }
  const handleDeleteService = (id: number) => {
    if (!profile) return
    const updated = { ...profile, services: (profile.services || []).filter(s => s.id !== id) }
    setProfile(updated)
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
  }

  // --- ГАЛЕРЕЯ ---
  const handleGalleryUpload = (info: { fileList: { originFileObj?: File }[] }) => {
    if (!profile) return
    const files = info.fileList
      .map(f => f.originFileObj)
      .filter((f): f is File => !!f)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        const updated = { ...profile, gallery: [...(profile.gallery || []), url] }
        setProfile(updated)
        localStorage.setItem('user', JSON.stringify(updated))
        setUser(updated)
      }
      reader.readAsDataURL(file)
    })
  }
  const handleDeleteGallery = (url: string) => {
    if (!profile) return
    const updated = { ...profile, gallery: (profile.gallery || []).filter(u => u !== url) }
    setProfile(updated)
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
  }

  // --- СЕРТИФИКАТЫ ---
  const handleCertUpload = (info: { fileList: { originFileObj?: File }[] }) => {
    if (!profile) return
    const files = info.fileList
      .map(f => f.originFileObj)
      .filter((f): f is File => !!f)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        const updated = { ...profile, certificates: [...(profile.certificates || []), url] }
        setProfile(updated)
        localStorage.setItem('user', JSON.stringify(updated))
        setUser(updated)
      }
      reader.readAsDataURL(file)
    })
  }
  const handleDeleteCert = (url: string) => {
    if (!profile) return
    const updated = { ...profile, certificates: (profile.certificates || []).filter(u => u !== url) }
    setProfile(updated)
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
  }

  if (!user || !profile) return null

  return (
    <div className="account account-grid">
      <div className="account-box">
        <Title level={2}>Личный кабинет</Title>
        <Text strong>Имя:</Text>{' '}
        {editMode ? (
          <Input
            value={profile.name}
            onChange={e => handleChange('name', e.target.value)}
            style={{ maxWidth: 240, marginBottom: 8 }}
          />
        ) : (
          <Text>{profile.name}</Text>
        )}
        <br />
        <Text strong>Роль:</Text> <Text>{profile.role === 'client' ? 'Клиент' : 'Тренер'}</Text>

        {profile.role === 'trainer' && (
          <div className="account-content">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div>
                <img
                  src={profile.img || 'https://via.placeholder.com/120x120?text=Фото'}
                  alt="Фото тренера"
                  style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }}
                />
                {editMode && (
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleUpload}
                  >
                    <Button icon={<UploadOutlined />}>Загрузить фото</Button>
                  </Upload>
                )}
              </div>
              <div style={{ width: '100%', maxWidth: 400 }}>
                <Text strong>Специализация:</Text>{' '}
                {editMode ? (
                  <Select
                    value={profile.specialty}
                    onChange={val => handleChange('specialty', val)}
                    style={{ width: '100%', marginBottom: 8 }}
                    placeholder="Выберите специализацию"
                  >
                    {specialties.map(s => (
                      <Option key={s} value={s}>{s}</Option>
                    ))}
                  </Select>
                ) : (
                  <Text>{profile.specialty || 'Не указано'}</Text>
                )}
                <br />
                <Text strong>О себе:</Text>
                {editMode ? (
                  <TextArea
                    value={profile.about}
                    onChange={e => handleChange('about', e.target.value)}
                    rows={3}
                    style={{ marginBottom: 8 }}
                  />
                ) : (
                  <div style={{ minHeight: 48 }}>{profile.about || <Text type="secondary">Нет описания</Text>}</div>
                )}
                <br />
                <Text strong>Рейтинг:</Text>{' '}
                {editMode ? (
                  <Rate allowHalf value={profile.rating || 0} onChange={val => handleChange('rating', val)} />
                ) : (
                  <Rate allowHalf value={profile.rating || 0} disabled />
                )}
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              {editMode ? (
                <>
                  <Button type="primary" onClick={handleSave} style={{ marginRight: 12 }}>Сохранить</Button>
                  <Button onClick={() => setEditMode(false)}>Отмена</Button>
                </>
              ) : (
                <Button type="primary" onClick={() => setEditMode(true)}>Редактировать профиль</Button>
              )}
            </div>
          </div>
        )}

        {profile.role === 'client' && (
          <div className="account-content">
            <Title level={4}>Добро пожаловать, {profile.name}!</Title>
            {profile.trial !== false ? (
              <>
                <Alert
                  message="У вас активен бесплатный пробный период (7 дней)"
                  type="success"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Button onClick={() => {
                  const updated = { ...profile, trial: false }
                  localStorage.setItem('user', JSON.stringify(updated))
                  setUser(updated)
                }} danger>
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
          </div>
        )}

        {profile.role === 'trainer' && (
          <>
            <div style={{ margin: '32px 0 16px', textAlign: 'left' }}>
              <Title level={5}>Образование</Title>
              {editMode ? (
                <Input
                  value={profile.education || ''}
                  onChange={e => handleChange('education', e.target.value)}
                  placeholder="Укажите образование"
                  style={{ marginBottom: 12 }}
                />
              ) : (
                <div>{profile.education || <Text type="secondary">Не указано</Text>}</div>
              )}
              <Title level={5} style={{ marginTop: 16 }}>Опыт работы</Title>
              {editMode ? (
                <Input
                  value={profile.experience || ''}
                  onChange={e => handleChange('experience', e.target.value)}
                  placeholder="Опыт работы (лет или описание)"
                  style={{ marginBottom: 12 }}
                />
              ) : (
                <div>{profile.experience || <Text type="secondary">Не указано</Text>}</div>
              )}
              <Title level={5} style={{ marginTop: 16 }}>Услуги и цены</Title>
              {editMode ? (
                <div style={{ marginBottom: 12 }}>
                  <Input
                    placeholder="Название услуги"
                    value={serviceForm.name}
                    onChange={e => setServiceForm(f => ({ ...f, name: e.target.value }))}
                    style={{ width: 180, marginRight: 8 }}
                  />
                  <Input
                    placeholder="Цена"
                    value={serviceForm.price}
                    onChange={e => setServiceForm(f => ({ ...f, price: e.target.value.replace(/[^0-9]/g, '') }))}
                    style={{ width: 100, marginRight: 8 }}
                  />
                  <Button icon={<PlusOutlined />} onClick={handleAddService} type="primary">Добавить</Button>
                </div>
              ) : null}
              <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
                {(profile.services || []).map(s => (
                  <li key={s.id} style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
                    <span>{s.name} — <b>{s.price} ₽</b></span>
                    {editMode && (
                      <Button size="small" icon={<DeleteOutlined />} danger style={{ marginLeft: 8 }} onClick={() => handleDeleteService(s.id)} />
                    )}
                  </li>
                ))}
                {(!profile.services || profile.services.length === 0) && <Text type="secondary">Нет услуг</Text>}
              </ul>
              <Title level={5} style={{ marginTop: 16 }}>Дополнительная информация</Title>
              {editMode ? (
                <TextArea
                  value={profile.extraInfo || ''}
                  onChange={e => handleChange('extraInfo', e.target.value)}
                  rows={2}
                  placeholder="Любая дополнительная информация о себе, подходах, методиках и т.д."
                />
              ) : (
                <div>{profile.extraInfo || <Text type="secondary">Нет информации</Text>}</div>
              )}
            </div>
            <div style={{ margin: '32px 0 16px', textAlign: 'left' }}>
              <Title level={5}>Галерея фото и видео</Title>
              <Upload
                listType="picture-card"
                multiple
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleGalleryUpload}
              >
                <div>
                  <PlusOutlined /> <div style={{ marginTop: 4 }}>Загрузить</div>
                </div>
              </Upload>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                {(profile.gallery || []).map((url, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    {url.match(/video\//) ? (
                      <video src={url} controls style={{ width: 90, height: 90, borderRadius: 8, objectFit: 'cover' }} />
                    ) : (
                      <img src={url} alt="media" style={{ width: 90, height: 90, borderRadius: 8, objectFit: 'cover' }} />
                    )}
                    <Button size="small" icon={<DeleteOutlined />} danger style={{ position: 'absolute', top: 2, right: 2 }} onClick={() => handleDeleteGallery(url)} />
                  </div>
                ))}
                {(!profile.gallery || profile.gallery.length === 0) && <Text type="secondary">Нет файлов</Text>}
              </div>
            </div>
            <div style={{ margin: '32px 0 16px', textAlign: 'left' }}>
              <Title level={5}>Документы и сертификаты</Title>
              <Upload
                listType="picture"
                multiple
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleCertUpload}
              >
                <Button icon={<FileImageOutlined />}>Загрузить сертификат</Button>
              </Upload>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                {(profile.certificates || []).map((url, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img src={url} alt="cert" style={{ width: 90, height: 90, borderRadius: 8, objectFit: 'cover', border: '1px solid #eee' }} />
                    <Button size="small" icon={<DeleteOutlined />} danger style={{ position: 'absolute', top: 2, right: 2 }} onClick={() => handleDeleteCert(url)} />
                  </div>
                ))}
                {(!profile.certificates || profile.certificates.length === 0) && <Text type="secondary">Нет сертификатов</Text>}
              </div>
            </div>
            <div style={{ margin: '32px 0 0', textAlign: 'left' }}>
              <Title level={5}>Отзывы клиентов</Title>
              {/* Форма только для клиента */}
              {profile.role !== 'trainer' && (
                <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  <Input
                    placeholder="Ваше имя"
                    value={reviewForm.author}
                    onChange={e => setReviewForm(f => ({ ...f, author: e.target.value }))}
                    style={{ width: 140, marginRight: 8 }}
                    disabled={!editMode}
                  />
                  <Select
                    placeholder="Специализация"
                    value={reviewForm.specialization}
                    onChange={val => setReviewForm(f => ({ ...f, specialization: val }))}
                    style={{ width: 120, marginRight: 8 }}
                    disabled={!editMode}
                  >
                    {specialties.map(s => (
                      <Option key={s} value={s}>{s}</Option>
                    ))}
                  </Select>
                  <Rate
                    allowHalf
                    value={reviewForm.rating}
                    onChange={val => setReviewForm(f => ({ ...f, rating: val }))}
                    style={{ marginRight: 8 }}
                    disabled={!editMode}
                  />
                  <Input
                    placeholder="Цена"
                    value={reviewForm.price}
                    onChange={e => setReviewForm(f => ({ ...f, price: e.target.value.replace(/[^0-9]/g, '') }))}
                    style={{ width: 80, marginRight: 8 }}
                    disabled={!editMode}
                  />
                  <Input.TextArea
                    placeholder="Ваш отзыв"
                    value={reviewForm.text}
                    onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                    style={{ width: 220, marginRight: 8, verticalAlign: 'top' }}
                    rows={1}
                    disabled={!editMode}
                  />
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddReview} disabled={!editMode || !reviewForm.author || !reviewForm.text}>Оставить отзыв</Button>
                </div>
              )}
              <div style={{ maxHeight: 220, overflowY: 'auto', background: '#fafafa', borderRadius: 8, padding: 12 }}>
                {(() => {
                  // Сортировка: новые сверху
                  let reviews = (profile.reviews || [])
                  if (profile.role === 'trainer') {
                    reviews = [...fakeTrainerReviews, ...reviews]
                  }
                  reviews = reviews.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  if (reviews.length === 0) return <Text type="secondary">Пока нет отзывов</Text>
                  return reviews.map(r => (
                    profile.role === 'trainer' ? (
                      <div key={r.id} style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: 16, paddingBottom: 16, alignItems: 'flex-start', gap: 24 }}>
                        <div style={{ minWidth: 90, textAlign: 'center' }}>
                          <Rate allowHalf value={r.rating} disabled style={{ fontSize: 22, color: '#faad14' }} />
                          <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{new Date(r.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 17 }}>{r.author}</div>
                          {r.specialization && <div style={{ color: '#888', fontSize: 15, marginBottom: 2 }}>{r.specialization}</div>}
                          {r.text && <div style={{ fontSize: 16, margin: '6px 0 10px' }}>{r.text}</div>}
                        </div>
                      </div>
                    ) : (
                      <div key={r.id} style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: 16, paddingBottom: 16, alignItems: 'flex-start', gap: 24 }}>
                        <div style={{ minWidth: 90, textAlign: 'center' }}>
                          <Rate allowHalf value={r.rating} disabled style={{ fontSize: 22, color: '#faad14' }} />
                          <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{new Date(r.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 17 }}>{r.author}</div>
                          {r.specialization && <div style={{ color: '#888', fontSize: 15, marginBottom: 2 }}>{r.specialization}</div>}
                          <div style={{ fontSize: 16, margin: '6px 0 10px' }}>{r.text}</div>
                          {r.price && <div style={{ color: '#888', fontSize: 14 }}>Стоимость работ<br /><span style={{ fontWeight: 600, fontSize: 18, color: '#222' }}>{r.price} ₽</span></div>}
                        </div>
                      </div>
                    )
                  ))
                })()}
              </div>
            </div>
          </>
        )}

        <Button type="primary" danger onClick={handleLogout} style={{ marginTop: 24 }}>
          Выйти
        </Button>
      </div>
      {profile.role === 'trainer' && (
        <div className="account-clients-box">
          <Title level={4} style={{ marginBottom: 16 }}>Клиенты ({clients.length})</Title>
          <Collapse accordion>
            {clients.map(client => {
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
                height: 180,
                smooth: true,
                tooltip: { showMarkers: true },
              }
              return (
                <Panel header={client.name} key={client.id}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Возраст:</Text> {client.age} <br />
                    <Text strong>Рост:</Text> {client.height} см <br />
                    <Text strong>Вес:</Text> {client.weight} кг
                  </div>
                  <Title level={5} style={{ margin: '12px 0 8px' }}>Тренировки</Title>
                  <ul style={{ paddingLeft: 16 }}>
                    {client.trainings
                      .slice()
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((t, idx) => (
                        <li key={idx}>
                          <b>{t.type}</b> — {new Date(t.date).toLocaleDateString()} (прогресс: {t.progress}%)
                        </li>
                      ))}
                  </ul>
                  <div style={{ marginTop: 24 }}>
                    <Title level={5} style={{ marginBottom: 8 }}>Прогресс клиента</Title>
                    <Line {...chartConfig} />
                  </div>
                </Panel>
              )
            })}
          </Collapse>
        </div>
      )}
    </div>
  )
}

export default AccountPage
