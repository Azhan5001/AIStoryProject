export function getBotResponse(input) {
  const text = input.toLowerCase();

  if (text.includes('hello') || text.includes('hi')) {
    return 'Hello! How can I help you?';
  }

  if (text.includes('date')) {
    return `Today is ${new Date().toDateString()}`;
  }

  if (text.includes('time')) {
    return `Current time is ${new Date().toLocaleTimeString()}`;
  }

  if (text.includes('name')) {
    return 'I am your Lit chatbot 🤖';
  }

  if (text.includes('bye')) {
    return 'Goodbye! 👋';
  }

  return "I don't understand that yet 😅";
}