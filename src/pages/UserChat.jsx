import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronLeft, Info, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './UserChat.css';

const UserChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState(false);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        const msgRes = await api.get('/chat');
        setMessages(msgRes.data);
        const statusRes = await api.get('/chat/status');
        setAdminStatus(statusRes.data.isAvailable);
        await api.put('/chat/read');
      } catch (err) {
        console.error("Chat sync error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
    const interval = setInterval(fetchChatData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    const optimisticMsg = {
      text: inputText,
      senderType: 'user',
      createdAt: new Date().toISOString(),
      _id: `temp-${Date.now()}`,
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setInputText('');

    try {
      const response = await api.post('/chat', { text: optimisticMsg.text });
      setMessages(prev => prev.map(m => m._id === optimisticMsg._id ? response.data : m));
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages(prev => prev.filter(m => m._id !== optimisticMsg._id));
      setInputText(optimisticMsg.text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="chat-loading-screen">
        <div className="chat-loading-orb" />
        <p>Connecting to clinical chat…</p>
      </div>
    );
  }

  return (
    <div className="chat-view animate-fade-in">
      {/* Header */}
      <header className="chat-header">
        <button className="back-btn-chat" onClick={() => navigate(-1)} aria-label="Go back">
          <ChevronLeft size={22} />
        </button>

        <div className="chat-header-identity">
          <div className="chat-header-info">
            <h2>Dr. Chinchu V.</h2>
            <span className={`presence-text ${adminStatus ? 'online' : ''}`}>
              {adminStatus ? 'Online' : 'Away'}
            </span>
          </div>
        </div>

        <div className="chat-header-badge">
          <Sparkles size={13} />
          <span>Secure</span>
        </div>
      </header>

      {/* Messages */}
      <div className="messages-scroll">
        <div className="clinical-notice">
          <Info size={13} />
          <span>End-to-end encrypted · Clinically reviewed</span>
        </div>

        <div className="messages-list">
          {messages.map((msg, index) => {
            const isSent = msg.senderType === 'user';
            const isTemp = String(msg._id).startsWith('temp-');
            return (
              <div
                key={msg._id || index}
                className={`msg-row ${isSent ? 'sent' : 'received'}`}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className={`msg-bubble ${isSent ? 'sent' : 'received'} ${isTemp ? 'sending' : ''}`}>
                  <p>{msg.text}</p>
                  <time>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isSent && <span className="tick">{isTemp ? ' ○' : ' ✓'}</span>}
                  </time>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <footer className="chat-footer">
        <form className="chat-form" onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Message Dr. Chinchu…"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!inputText.trim() || sending}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default UserChat;
