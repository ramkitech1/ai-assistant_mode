import React, { useState } from "react";
import axios from "axios";
import "./ChatUI.css";

function ChatUI() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [mode, setMode] = useState("generic");
  const [customPrompt, setCustomPrompt] = useState("");

  //  Handle mode switch + clear chat
  const switchMode = (newMode) => {
    setMode(newMode);
    setChat([]); //  clear old chat
  };

  const sendMessage = async () => {
    if (!message) return;

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", {
        message,
        mode,
        custom_prompt: customPrompt,
      });

      setChat([
        ...chat,
        { user: message, bot: res.data.response },
      ]);

      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Backend not connected!");
    }
  };

  return (
    <div className="container">
      <h2>AI Assistant</h2>

      {/* MODE SWITCH */}
      <div className="mode-buttons">
        <button
          className={mode === "generic" ? "active" : ""}
          onClick={() => switchMode("generic")}
        >
          Generic Mode
        </button>

        <button
          className={mode === "custom" ? "active" : ""}
          onClick={() => switchMode("custom")}
        >
          User Prompt Mode
        </button>
      </div>

      <p className="mode-text">Current Mode: {mode}</p>

      {/* CUSTOM PROMPT */}
      {mode === "custom" && (
        <textarea
          className="prompt-box"
          placeholder="Enter your prompt here..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
        />
      )}

      {/* CHAT BOX */}
      <div className="chat-box">
        {chat.map((c, i) => (
          <div key={i}>
            <div className="user-msg">{c.user}</div>
            <div className="bot-msg">{c.bot}</div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
             if (e.key === "Enter") {
              e.preventDefault();
            sendMessage();
           }
         }}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatUI;