
import React, { useRef, useEffect } from 'react';
import type { Message as MessageType } from '../types';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-grow p-6 overflow-y-auto">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      {isTyping && (
        <div className="flex items-start gap-3 my-4 justify-start">
           <div className="w-10 h-10 rounded-full bg-indigo flex items-center justify-center text-white font-bold flex-shrink-0">
             Z
           </div>
           <div className="bg-gray-200 rounded-lg rounded-tl-none p-2">
            <TypingIndicator />
           </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
