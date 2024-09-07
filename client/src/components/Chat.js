import React, { useState, useEffect, useRef } from "react";
import axios from "../axios";
import Message from "./Message";

function Chat({ username, messages, setMessages }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const inputRef = useRef(null); // Create a ref for the input field

  const chatBottomRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() !== "" && !loading) {
      setLoading(true); // Set loading state to true when sending starts
      const messageData = {
        username: username,
        message: message,
      };

      try {
        // Send the message to the backend
        setMessage(""); // Clear the input
        await axios.post("/messages", messageData);
        // Ensure the input ref exists, and set focus back to the input
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.error("Error sending message", error);
      } finally {
        setLoading(false); // Set loading state to false when done
      }
    }
  };

  const deleteMessage = async (messageId) => {
    await axios.delete(`/messages/${messageId}`);
  };

  return (
    <div className="flex flex-col h-[90vh] w-full max-w-3xl mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-xl mt-10 mb-5 p-6 relative">
      <div className="flex-1 overflow-auto bg-white rounded-lg p-4 shadow-inner mb-4">
        {(messages || []).map((msg) => (
          <Message
            key={msg._id || Math.random()}
            messageData={msg}
            username={username}
            deleteMessage={deleteMessage}
          />
        ))}
        <div ref={chatBottomRef} />
      </div>
      <form
        onSubmit={sendMessage}
        className="flex gap-3 bg-white p-4 rounded-lg shadow-lg"
      >
        <input
          ref={inputRef} // Attach the inputRef to this input field
          type="text"
          autoFocus
          placeholder="Type your message..."
          className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-md"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className={`px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg transition-transform transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} // Add disabled styles when loading
          disabled={loading} // Disable button when loading
        >
          {loading ? "Sending..." : "Send"} {/* Show loading text */}
        </button>
      </form>
    </div>
  );
}

export default Chat;
