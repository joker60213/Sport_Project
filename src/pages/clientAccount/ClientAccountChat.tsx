import { useState, useRef, useEffect } from 'react'
import { Button, Input, List, Avatar, Card } from 'antd'
import { SendOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons'
import './ClientAccountChat.scss'

interface Message {
  id: number
  author: 'trainer' | 'client'
  text: string
  time: string
}

interface ClientAccountChatProps {
  trainerName: string
  onClose: () => void
}

const ClientAccountChat = ({ trainerName, onClose }: ClientAccountChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    // Демонстрационные сообщения, в реальном приложении они будут загружаться с сервера
    {
      id: 1,
      author: 'trainer',
      text: 'Здравствуйте! Как ваши тренировки?',
      time: '10:30'
    },
    {
      id: 2,
      author: 'client',
      text: 'Добрый день! Все отлично, прогресс есть',
      time: '10:35'
    }
  ]);
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, {
      id: Date.now(),
      author: 'client',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setInput('')

    // Имитация ответа от тренера (в реальном приложении будет API)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        author: 'trainer',
        text: 'Отлично! Продолжайте в том же духе. У вас хорошо получается.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 2000)
  }

  return (
    <Card 
      className="client-account-chat-card" 
      title={`Чат с тренером: ${trainerName}`}
      style={{ position: 'fixed', right: 40, bottom: 24, width: 340, zIndex: 1000 }}
      bodyStyle={{ padding: 12, height: 320, display: 'flex', flexDirection: 'column' }}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onClose} />}
    >
      <div className="client-account-chat-messages" style={{ flex: 1, overflowY: 'auto', marginBottom: 8, marginRight: 4 }}>
        <List
          dataSource={messages}
          renderItem={msg => (
            <List.Item style={{ justifyContent: msg.author === 'client' ? 'flex-end' : 'flex-start' }}>
              {msg.author === 'trainer' && <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />}
              <div style={{ 
                background: msg.author === 'client' ? 'rgba(86, 171, 47, 0.1)' : 'rgba(24, 144, 255, 0.1)', 
                borderRadius: 8, 
                padding: '6px 12px', 
                maxWidth: 200,
                border: `1px solid ${msg.author === 'client' ? 'rgba(86, 171, 47, 0.2)' : 'rgba(24, 144, 255, 0.2)'}`
              }}>
                <div style={{ fontSize: 13 }}>{msg.text}</div>
                <div style={{ fontSize: 11, color: '#888', textAlign: 'right' }}>{msg.time}</div>
              </div>
              {msg.author === 'client' && <Avatar icon={<UserOutlined />} style={{ marginLeft: 8, background: '#56ab2f' }} />}
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} />
      </div>
      <Input.Group compact>
        <Input
          style={{ width: 'calc(100% - 40px)' }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onPressEnter={sendMessage}
          placeholder="Введите сообщение..."
        />
        <Button type="primary" icon={<SendOutlined />} onClick={sendMessage} />
      </Input.Group>
    </Card>
  )
}

export default ClientAccountChat 