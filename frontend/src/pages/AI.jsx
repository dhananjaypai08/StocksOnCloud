import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';

export const AI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulating API call
      const response = await new Promise(resolve => setTimeout(() => resolve(mockApiResponse), 1000));
      
      const formattedResponse = formatResponse(response);
      setMessages(prev => [...prev, { type: 'bot', content: formattedResponse }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (response) => {
    const { strategy } = response;
    let formattedContent = '';

    formattedContent += '**Strategy:**\n\n';
    formattedContent += '**Indicators:**\n';
    strategy.indicators.forEach(indicator => {
      formattedContent += `- ${indicator.name}\n`;
      Object.entries(indicator.parameters).forEach(([key, value]) => {
        formattedContent += `  - ${key}: ${value}\n`;
      });
    });

    formattedContent += '\n**Rules:**\n';
    strategy.rules.forEach((rule, index) => {
      formattedContent += `${index + 1}. **Conditions:**\n`;
      rule.condition.forEach(condition => {
        formattedContent += `   - ${condition}\n`;
      });
      formattedContent += `   **Action:** ${rule.action}\n\n`;
    });

    return formattedContent;
  };

  return (
    <div className='bg-[#131314]'>
    <div className="flex flex-col h-screen bg-black">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-[#1E1F20] text-white'}`}>
              <pre className="whitespace-pre-wrap font-sans">
                {message.content}
              </pre>
            </div>
          </div>
        ))}
        {isLoading && <div className="text-center">Loading...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex ">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 text-white p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#1E1F20]"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send size={24} />
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

// Mock API response for demonstration
const mockApiResponse = {
  "strategy": {
    "indicators": [
      {
        "name": "Moving Average",
        "parameters": {
          "period": 200
        }
      },
      {
        "name": "Relative Strength Index",
        "parameters": {
          "period": 14
        }
      }
    ],
    "rules": [
      {
        "condition": [
          "Moving Average.value > Close.value",
          "Relative Strength Index.value < 30"
        ],
        "action": "Buy"
      },
      {
        "condition": [
          "Moving Average.value < Close.value",
          "Relative Strength Index.value > 70"
        ],
        "action": "Sell"
      }
    ]
  }
};

