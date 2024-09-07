import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import Chat from "./components/Chat";
import "./App.css";
import axios from "./axios";

// Initialize Pusher
const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
  cluster: process.env.REACT_APP_PUSHER_CLUSTER,
  useTLS: true,
});

console.log('pusher', pusher);
console.log('process.env', process.env);
console.log('REACT_APP_PUSHER_KEY', process.env.REACT_APP_PUSHER_KEY);
console.log('REACT_APP_PUSHER_CLUSTER', process.env.REACT_APP_PUSHER_CLUSTER);

function App() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });
  const [isChatVisible, setIsChatVisible] = useState(
    !!localStorage.getItem("username")
  );
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (isChatVisible) {
      // Request previous messages from the backend
      axios
        .get("/messages")
        .then((res) => {
          setMessages(res.data); // Set messages received from the backend
        })
        .catch((err) => console.error(err));
      // Subscribe to the "chat" channel
      const channel = pusher.subscribe("chat");

      // Listen for new messages
      channel.bind("newMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Listen for message deletion
      channel.bind("deleteMessage", (data) => {
        setMessages((prevMessages) => {
          return prevMessages.filter((msg) => msg._id !== data.messageId);
        });
      });

      // Clean up the subscription when the component unmounts
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [isChatVisible]);

  const joinChat = () => {
    if (username.trim() !== "") {
      localStorage.setItem("username", username);
      setIsChatVisible(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("username");
    setUsername("");
    setIsChatVisible(false);
  };

  return (
    <div className="relative flex justify-center items-center h-[100vh] bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 pt-2">
      {isChatVisible && (
        <div className="absolute top-4 right-6 flex items-center space-x-4">
          <span className="text-white font-semibold">
            Logged in as: {username}
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Logout
          </button>
        </div>
      )}

      {!isChatVisible ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white shadow-2xl rounded-2xl max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
            Join the Chat
          </h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg mb-6 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400 transition duration-300"
          />
          <button
            onClick={joinChat}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Join
          </button>
        </div>
      ) : (
        <div className="flex flex-col w-full items-center">
          <Chat
            username={username}
            messages={messages || []}
            setMessages={setMessages}
          />
        </div>
      )}
    </div>
  );
}

export default App;
