let chatHistory = [];

function addMessage(role, content) {
  chatHistory.push({ role, content });
  if (chatHistory.length > 16) chatHistory = chatHistory.slice(-16);
}

function getFormattedContext() {
  return chatHistory
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');
}

function clearHistory() {
  chatHistory = [];
}

module.exports = {
  addMessage,
  getFormattedContext,
  clearHistory,
};
