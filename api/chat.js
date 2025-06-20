document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.getElementById("chat-icon");
  const chatWindow = document.getElementById("chat-window");
  const chatLog = document.getElementById("chat-log");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");

  // Åbn chat automatisk med velkomstbesked
  chatWindow.style.display = "block";
  addMessage("D3SIGN Lab AI", "Hej, jeg er din D3SIGN Lab assistent. Hvad kan jeg hjælpe med?");

  chatIcon.addEventListener("click", () => {
    chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
  });

  sendButton.addEventListener("click", async () => {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage("Du", message);
    userInput.value = "";

    try {
      const response = await fetch("https://d3signlab-chat.vercel.app/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: message }],
          language: "danish"
        })
      });

      if (!response.ok) {
        throw new Error("Serverfejl: " + response.status);
      }

      const data = await response.json();
      const reply = data.message || "Beklager, jeg kunne ikke finde et svar.";
      addMessage("D3SIGN Lab AI", reply);
    } catch (error) {
      addMessage("Fejl", "Noget gik galt: " + error.message);
    }
  });

  function addMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
});
