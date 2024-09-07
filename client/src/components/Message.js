import React, { useState } from "react";

function Message({ messageData, username, deleteMessage }) {
  const [isDeleting, setIsDeleting] = useState(false); // Add state to track deleting status
  const isOwnMessage = messageData.username === username;

  // Function to calculate time ago
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageTime) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 }, // 365 * 24 * 60 * 60
      { label: "month", seconds: 2592000 }, // 30 * 24 * 60 * 60
      { label: "day", seconds: 86400 }, // 24 * 60 * 60
      { label: "hour", seconds: 3600 }, // 60 * 60
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const timeAgo = Math.floor(diffInSeconds / interval.seconds);
      if (timeAgo >= 1) {
        return `${timeAgo} ${interval.label}${timeAgo > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  // Get the human-readable formatted time
  const formattedTime = getTimeAgo(messageData.timestamp);

  const handleDelete = async () => {
    setIsDeleting(true); // Start loading state
    try {
      await deleteMessage(messageData._id); // Call the delete message function
    } catch (error) {
      console.error("Error deleting message", error);
    } finally {
      setIsDeleting(false); // Stop loading state after deletion is complete
    }
  };

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-4 rounded-lg shadow-md ${
          isOwnMessage
            ? "bg-indigo-500 text-white self-end"
            : "bg-gray-200 text-gray-800 self-start"
        }`}
      >
        <p className="text-sm">{messageData.message}</p>
        <p className="text-xs mt-1 text-left">
          {!isOwnMessage ? `@${messageData.username}` : "me"} • {formattedTime}
        </p>
        {isOwnMessage && (
          <button
            onClick={handleDelete}
            className={`text-xs text-white mt-2 underline ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isDeleting} // Disable the button while deleting
          >
            {isDeleting ? "Deleting..." : "Delete"} {/* Show loading text */}
          </button>
        )}
      </div>
    </div>
  );
}

export default Message;
