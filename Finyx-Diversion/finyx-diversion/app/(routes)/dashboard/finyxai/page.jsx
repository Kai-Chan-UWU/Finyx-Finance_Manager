"use client";
import React, { useState } from "react";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch a response from the backend API
  const fetchAIResponse = async (message) => {
    const response = await fetch("/api/finyxai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        userId: "test-user", // Replace with actual user ID management
        message 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    
    setIsLoading(true);
    try {
      const aiResponse = await fetchAIResponse(input);
      const aiMessage = { text: aiResponse, sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Chat with Finyx AI</h2>
      <div className="h-96 overflow-y-auto mb-4 bg-gray-50 p-4 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <span className="inline-block p-2 bg-gray-200 rounded-lg">
              Finyx AI is typing...
            </span>
          </div>
        )}
      </div>

      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 p-2 border rounded-l-lg focus:outline-none"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="bg-emerald-500 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;