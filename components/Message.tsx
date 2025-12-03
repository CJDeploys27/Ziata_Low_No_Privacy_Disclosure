
import React from 'react';
import type { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start gap-3 my-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-10 h-10 rounded-full bg-indigo flex items-center justify-center text-white font-bold flex-shrink-0">
          Z
        </div>
      )}
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-lg text-black ${
          isBot ? 'bg-gray-200 rounded-tl-none' : 'bg-indigo text-white rounded-br-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
       {!isBot && (
        <div className="w-10 h-10 rounded-full bg-indigo flex items-center justify-center text-white font-bold flex-shrink-0">
          Me
        </div>
      )}
    </div>
  );
};

export default Message;
