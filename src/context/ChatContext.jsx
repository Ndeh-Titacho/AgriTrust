import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set, remove } from 'firebase/database';

const firebaseConfig = {
  // Add your Firebase configuration here
  // You'll need to create a Firebase project and get these credentials
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    if (activeChat) {
      const messagesRef = ref(database, `chats/${activeChat}`);
      
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setMessages(Object.values(data));
        } else {
          setMessages([]);
        }
      });

      return () => unsubscribe();
    }
  }, [activeChat]);

  const sendMessage = async (message, sender, receiver) => {
    const messagesRef = ref(database, `chats/${sender}-${receiver}`);
    const newMessageRef = push(messagesRef);
    
    await set(newMessageRef, {
      id: newMessageRef.key,
      text: message,
      sender,
      timestamp: new Date().toISOString(),
      read: false
    });

    // Also create a mirror in the receiver's chat list
    const receiverMessagesRef = ref(database, `chats/${receiver}-${sender}`);
    await set(push(receiverMessagesRef), {
      id: newMessageRef.key,
      text: message,
      sender,
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const markAsRead = async (messageId, sender, receiver) => {
    const messageRef = ref(database, `chats/${sender}-${receiver}/${messageId}`);
    await set(messageRef, {
      read: true
    });
  };

  return (
    <ChatContext.Provider value={{
      messages,
      activeChat,
      setActiveChat,
      sendMessage,
      markAsRead
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
