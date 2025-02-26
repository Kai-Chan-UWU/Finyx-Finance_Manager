"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, isSignedIn, isLoaded } = useUser();

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to fetch a response from the backend API
  const fetchAIResponse = async (message) => {
    if (!isSignedIn || !user) {
      throw new Error("You must be signed in to use this feature");
    }

    const response = await fetch("/api/finyxai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        userId: user.id, // Use Clerk user ID
        message 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
        text: error.message || "Sorry, I couldn't process your request. Please try again.",
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="p-4">Loading authentication...</div>;
  }

  if (!isSignedIn) {
    return <div className="p-4">Please sign in to use the AI chat.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Chat with Finyx AI</h2>
      <div className="h-96 overflow-y-auto mb-4 bg-gray-50 p-4 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-3 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-4">
            <span className="inline-block p-3 bg-gray-200 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 p-3 border rounded-l-lg focus:outline-none"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-r-lg transition-colors"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;