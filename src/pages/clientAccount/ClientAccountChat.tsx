import { useState, useRef, useEffect } from 'react'
import { Button, Input, List, Avatar, Card, Typography } from 'antd'
import { SendOutlined, UserOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons'
import './ClientAccountChat.scss'
import { Message, ClientAccountChatProps } from '../../types'

const { Text } = Typography;

// Моковая история чатов с тренерами
const mockChatHistory: Record<number, Message[]> = {
  1: [
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
  ],
  2: [
    {
      id: 1,
      author: 'trainer',
      text: 'Приветствую! Как продвигается растяжка?',
      time: '11:15'
    },
    {
      id: 2,
      author: 'client',
      text: 'Стараюсь выполнять все упражнения регулярно',
      time: '11:20'
    }
  ]
};

const ClientAccountChat = ({ 
  onClose, 
  onCloseChat, 
  activeChats, 
  currentChatIndex, 
  setCurrentChatIndex
}: ClientAccountChatProps) => {
  // Создаем объект для хранения сообщений по id тренера
  const [chatMessages, setChatMessages] = useState<Record<number, Message[]>>({});
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Инициализируем историю сообщений при первой загрузке
    setChatMessages(mockChatHistory);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, currentChatIndex]);

  const sendMessage = () => {
    if (!input.trim() || currentChatIndex < 0) return
    
    const currentTrainer = activeChats[currentChatIndex];
    const newMessage: Message = {
      id: Date.now(),
      author: 'client',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => {
      const messages = [...(prev[currentTrainer.id] || []), newMessage];
      return { ...prev, [currentTrainer.id]: messages };
    });
    
    setInput('');

    // Имитация ответа от тренера (в реальном приложении будет API)
    setTimeout(() => {
      setChatMessages(prev => {
        const messages = [
          ...(prev[currentTrainer.id] || []), 
          {
            id: Date.now() + 1,
            author: 'trainer' as const,
            text: 'Отлично! Продолжайте в том же духе. У вас хорошо получается.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
        return { ...prev, [currentTrainer.id]: messages };
      });
    }, 2000);
  };

  if (currentChatIndex < 0 || activeChats.length === 0) {
    return null;
  }

  const currentTrainer = activeChats[currentChatIndex];
  const currentMessages = chatMessages[currentTrainer.id] || [];

  return (
    <Card 
      className="client-account-chat-card" 
      title={
        <div className="chat-header">
          <div className="chat-title-row">
            <Text strong className="chat-title">
              Чат с тренером: <span className="trainer-name">{activeChats[currentChatIndex]?.name}</span>
            </Text>
          </div>
          <div className="chat-trainers-tabs">
            {activeChats.length > 1 && (
              <div className="trainers-list">
                {activeChats.map((trainer, index) => (
                  <Button 
                    key={index}
                    type={index === currentChatIndex ? "primary" : "default"}
                    size="small"
                    onClick={() => setCurrentChatIndex(index)}
                    className="trainer-tab-button"
                  >
                    {trainer.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      }
      style={{ position: 'fixed', right: 40, bottom: 24, width: 340, zIndex: 1000 }}
      bodyStyle={{ padding: 12, height: 320, display: 'flex', flexDirection: 'column' }}
      extra={
        <div className="chat-controls">
          <Button type="text" icon={<MinusOutlined />} onClick={onClose} className="chat-button" />
          <Button type="text" icon={<CloseOutlined />} onClick={onCloseChat} className="chat-button" />
        </div>
      }
    >
      <div className="client-account-chat-messages" style={{ flex: 1, overflowY: 'auto', marginBottom: 8, marginRight: 4 }}>
        <List
          dataSource={currentMessages}
          renderItem={msg => (
            <List.Item style={{ justifyContent: msg.author === 'client' ? 'flex-end' : 'flex-start' }}>
              {msg.author === 'trainer' && <Avatar src={activeChats[currentChatIndex]?.img} icon={<UserOutlined />} style={{ marginRight: 8 }} />}
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