class MessageParser {
  constructor(actionProvider) {
      this.actionProvider = actionProvider;
  }

  parse(message) {
      console.log("🔹 User typed message:", message); // Debugging log
      
      if (message.trim().length === 0) {
          console.warn("⚠️ Empty message entered.");
          return;
      }

      this.actionProvider.setUserMessage(message);
  }
}

export default MessageParser;
