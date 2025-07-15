export const simulateAiResponse = async (userMessage: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
  
  // Simple AI response simulation
  const responses = [
    `I understand you said: "${userMessage}". That's interesting!`,
    `Thanks for sharing that with me. Can you tell me more about "${userMessage}"?`,
    `I see you mentioned "${userMessage}". Here's what I think about that...`,
    `That's a great point about "${userMessage}". Let me elaborate on that.`,
    `Regarding "${userMessage}", I have some thoughts to share with you.`,
  ];
  
  // Add some variety based on message content
  if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
    return "Hello! How can I help you today?";
  }
  
  if (userMessage.toLowerCase().includes('how are you')) {
    return "I'm doing well, thank you for asking! How are you doing?";
  }
  
  if (userMessage.toLowerCase().includes('bye') || userMessage.toLowerCase().includes('goodbye')) {
    return "Goodbye! It was nice chatting with you. Have a great day!";
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString();
  }
};

export const generateRoomName = (firstMessage: string): string => {
  const maxLength = 30;
  const cleaned = firstMessage.trim().replace(/\s+/g, ' ');
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  return cleaned.substring(0, maxLength - 3) + '...';
};
