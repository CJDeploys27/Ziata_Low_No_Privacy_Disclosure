import React, { useState } from 'react';
import Header from './Header';
import MessageList from './MessageList';
import MenuOptions from './MenuOptions';
import { getQuestion, calculateRecommendation } from './dialogueService';
import { RESPONSE_DELAY } from './constants';
import type { Message, Topic, MenuOption } from './types';

const App: React.FC = () => {
    const createInitialMessages = (): Message[] => [
        {
            id: 'welcome-1',
            sender: 'bot',
            text: "Welcome! I'm Ziata, your Lifestyle and Wellness Assistant. My goal is to help you improve your life with tiny, sustainable changes.",
        },
        {
            id: 'welcome-2',
            text: 'Are you ready to speak with Ziata?',
            options: [{ text: 'Begin', value: 'begin', needScore: 0, subtype: 'COGNITIVE' }],
            sender: 'bot'
        },
    ];

    const [messages, setMessages] = useState<Message[]>(createInitialMessages);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [optionsDisabled, setOptionsDisabled] = useState<boolean>(false);

    const addMessage = (message: Omit<Message, 'id'>) => {
        setMessages(prev => [...prev, { ...message, id: Date.now().toString() }]);
    };

    const resetChat = () => {
        setMessages(createInitialMessages());
        setIsTyping(false);
        setCurrentTopic(null);
        setQuestionIndex(0);
        setUserAnswers([]);
        setOptionsDisabled(false);
    }

    const handleUserResponse = (option: MenuOption) => {
        setMessages(prev => {
            const updatedPrev = prev.map((msg, index) => 
                index === prev.length - 1 ? { ...msg, options: undefined } : msg
            );
            return [...updatedPrev, { text: option.text, sender: 'user', id: Date.now().toString() }];
        });

        setOptionsDisabled(true);
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            
            // Flow Control
            if (option.value === 'begin') {
                addMessage({
                    sender: 'bot',
                    text: "Which topic would you like to discuss with Ziata? Please click below to select from the menu of available topics.",
                    options: [
                        { text: 'Sleep Habits', value: 'sleep', needScore: 0, subtype: 'COGNITIVE'},
                        { text: 'Exercise and Energy Levels', value: 'exercise', needScore: 0, subtype: 'COGNITIVE'},
                        { text: 'Food and Diet', value: 'food', needScore: 0, subtype: 'COGNITIVE'},
                        { text: 'Habit Formation', value: 'habits', needScore: 0, subtype: 'COGNITIVE'},
                    ]
                });
                setOptionsDisabled(false);
            } else if (option.value === 'end_session') {
                addMessage({
                    sender: 'bot',
                    text: "This session has ended. Thank you for your time. Please return to survey."
                });
            } else if (['sleep', 'exercise', 'food', 'habits'].includes(option.value)) {
                const topic = option.value as Topic;
                setCurrentTopic(topic);
                const nextQuestion = getQuestion(topic, 0);
                if (nextQuestion) {
                    addMessage({ sender: 'bot', text: nextQuestion.text, options: nextQuestion.options });
                    setOptionsDisabled(false);
                }
            } else if (currentTopic) {
                const newAnswers = [...userAnswers, option.value];
                setUserAnswers(newAnswers);

                const nextQuestionIndex = questionIndex + 1;
                const nextQuestion = getQuestion(currentTopic, nextQuestionIndex);

                if (nextQuestion) {
                    setQuestionIndex(nextQuestionIndex);
                    addMessage({ sender: 'bot', text: nextQuestion.text, options: nextQuestion.options });
                    setOptionsDisabled(false);
                } else {
                    // End of questions, calculate and show recommendation
                    const recommendation = calculateRecommendation(currentTopic, newAnswers);
                    addMessage({ sender: 'bot', text: "Thank you for sharing. Here is a recommendation:" });
                    addMessage({ sender: 'bot', text: recommendation });

                    // Final sign-off message
                    setTimeout(() => {
                         addMessage({
                            sender: 'bot',
                            text: "Thank you for chatting with Ziata. Remember, small changes lead to remarkable results. Have a great day!",
                            options: [
                                { text: 'End Session', value: 'end_session', needScore: 0, subtype: 'COGNITIVE' },
                            ]
                        });
                        setOptionsDisabled(false);
                    }, 1500);
                }
            } else if (option.value === 'reset') {
                resetChat();
            }

        }, RESPONSE_DELAY);
    };

    const currentOptions = messages[messages.length - 1]?.options || [];

    return (
        <div className="h-screen w-screen flex justify-center items-center p-4 bg-gray-200">
            <div className="flex flex-col h-full w-full max-w-2xl bg-white shadow-2xl rounded-lg">
                <Header />
                <main className="flex-1 flex flex-col pt-24 overflow-hidden">
                    <MessageList messages={messages} isTyping={isTyping} />
                    <div className="border-t border-gray-200">
                      {currentOptions.length > 0 && (
                          <MenuOptions 
                              options={currentOptions} 
                              onSelect={handleUserResponse} 
                              disabled={optionsDisabled}
                          />
                      )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;