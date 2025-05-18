import { useState, useRef, useEffect } from 'react'
import { Button, Input, List, Avatar, Card } from 'antd'
import { SendOutlined, UserOutlined, CloseOutlined, MessageOutlined } from '@ant-design/icons'
import './ClientChat.scss'

interface Message {
  id: number
  author: 'trainer' | 'client'
  text: string
  time: string
}

interface ClientChatProps {
  clientName: string
}

const ClientChat = ({ clientName }: ClientChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, {
      id: Date.now(),
      author: 'trainer',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setInput('')
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  if (!isOpen) {
    return (
      <Button
        type="primary"
        icon={<MessageOutlined />}
        onClick={toggleChat}
        className="chat-toggle-button"
        style={{ position: 'fixed', right: 40, bottom: 24, zIndex: 1000 }}
      >
        Чат с клиентом
      </Button>
    )
  }

  return (
    <Card 
      className="client-chat-card" 
      title={`Чат с клиентом: ${clientName}`}
      style={{ position: 'fixed', right: 40, bottom: 24, width: 340, zIndex: 1000 }}
      bodyStyle={{ padding: 12, height: 320, display: 'flex', flexDirection: 'column' }}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={toggleChat} />}
    >
      <div className="client-chat-messages" style={{ flex: 1, overflowY: 'auto', marginBottom: 8 }}>
        <List
          dataSource={messages}
          renderItem={msg => (
            <List.Item style={{ justifyContent: msg.author === 'trainer' ? 'flex-end' : 'flex-start' }}>
              {msg.author === 'client' && <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />}
              <div style={{ background: msg.author === 'trainer' ? '#e6f7ff' : '#f6ffed', borderRadius: 8, padding: '6px 12px', maxWidth: 200 }}>
                <div style={{ fontSize: 13 }}>{msg.text}</div>
                <div style={{ fontSize: 11, color: '#888', textAlign: 'right' }}>{msg.time}</div>
              </div>
              {msg.author === 'trainer' && <Avatar icon={<UserOutlined />} style={{ marginLeft: 8, background: '#1890ff' }} />}
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

export default ClientChat 