import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const ChatBox = ({ receiver }) => {
  const { messages, activeChat, setActiveChat, sendMessage } = useChat();
  const [messageText, setMessageText] = useState('');
  const [sender, setSender] = useState('');

  useEffect(() => {
    // Get sender's wallet address from context
    const walletContext = useWallet();
    setSender(walletContext.account);

    // Set active chat when component mounts
    setActiveChat(`${sender}-${receiver}`);
  }, [receiver, setActiveChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    await sendMessage(messageText, sender, receiver);
    setMessageText('');
  };

  return (
    <Card className="h-[600px] w-full">
      <CardHeader>
        <CardTitle>Chat with {receiver}</CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] flex flex-col">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${
                msg.sender === sender ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === sender 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`https://avatars.dicebear.com/api/identicon/${msg.sender}.svg`} />
                    <AvatarFallback>{msg.sender.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{msg.sender.slice(0, 6) + '...'}</span>
                </div>
                <p className="mt-1">{msg.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <Input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatBox;
