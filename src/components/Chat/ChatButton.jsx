import React from 'react';
import { Button } from '../ui/button';
import { MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import ChatBox from './ChatBox';

const ChatButton = ({ userAddress }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Chat
      </Button>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chat</DialogTitle>
        </DialogHeader>
        <ChatBox receiver={userAddress} />
      </DialogContent>
    </Dialog>
  );
};

export default ChatButton;
