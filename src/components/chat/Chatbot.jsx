import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Send, X, MessageCircle } from 'lucide-react';
import axios from 'axios';

// Initialize Gemini API
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

if (!GEMINI_API_KEY) {
  console.warn('Gemini API key is not set. Chat functionality will be limited.');
}

export const Chatbot = () => {
  const { isOpen, messages, toggleChat, addMessage, isTyping, setIsTyping } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !GEMINI_API_KEY) return;

    // Add user message
    const userMessage = input;
    addMessage(userMessage, 'user');
    setInput('');
    setIsTyping(true);

    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
              contents: [{
                parts: [{
                  text: `You are a helpful assistant for AgriTrust, an agricultural supply chain platform. ${userMessage}`
                }]
              }]
            },
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );

      const botResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                         'I apologize, but I am unable to process your request at the moment.';
      
      addMessage(botResponse, 'bot');
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = error.response?.data?.error?.message || error.message || 'An error occurred';
      addMessage(`Error: ${errorMessage}`, 'bot');
    } finally {
      setIsTyping(false);
    }
  };

  // ... rest of your component remains the same
  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-colors z-50"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col z-50" style={{ maxHeight: '70vh' }}>
      <div className="bg-green-600 text-white p-4 flex justify-between items-center">
        <h3 className="font-semibold">AgriTrust.ai</h3>
        <button onClick={toggleChat} className="text-white hover:text-gray-200">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-green-100 text-green-900 rounded-br-none'
                  : 'bg-white border border-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping || !GEMINI_API_KEY}
            className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;