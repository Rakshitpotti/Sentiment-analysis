async function fetchSummary(file, userMessage, sessionId) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_message", userMessage);
    formData.append("session_id", sessionId);
  
    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch summary");
    }
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";
  
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      accumulatedText += decoder.decode(value, { stream: true });
    }
  
    return accumulatedText;
  }
  
  export default fetchSummary;
  