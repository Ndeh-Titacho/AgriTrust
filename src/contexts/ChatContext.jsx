import React, { createContext, useState, useContext, useCallback } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Hello! I\'m your AgriTrust assistant. How can I help you today?', 
      sender: 'bot' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const addMessage = useCallback((text, sender) => {
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      text, 
      sender,
      timestamp: new Date().toISOString() 
    }]);
  }, []);

  return (
    <ChatContext.Provider 
      value={{ 
        isOpen, 
        messages, 
        isTyping, 
        toggleChat, 
        addMessage,
        setIsTyping
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
