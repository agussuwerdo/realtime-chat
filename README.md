
# Real-Time Chat App

A fully-functional real-time chat application that allows users to send and receive messages instantly. This app is built using modern web technologies with real-time updates powered by **Pusher**.

## Features

- **Real-Time Messaging**: Instantly send and receive messages without refreshing the page.
- **Message Broadcasting**: Messages are broadcast to all users in real-time.
- **Message Deletion**: Users can delete messages they sent, and the deletion is broadcast to other users.
- **Chat History**: Load previous chat messages when joining the chat room.
- **Username Persistence**: Usernames are stored locally, so users can continue chatting after refreshing the page without re-entering their username.
- **Responsive UI**: The app is mobile-friendly and responsive on all devices.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-Time Communication**: Pusher
- **Build Tool**: Webpack, React Scripts
- **Hosting**: Vercel

## How to Run Locally

1. Clone this repository.
   ```bash
   git clone https://github.com/agussuwerdo/realtime-chat-app.git
   cd realtime-chat-app
   ```

2. Install dependencies for both server and client.
   ```bash
   make install
   ```

3. Set up environment variables in the root and client `.env` file:
   ```bash
   PUSHER_APP_ID=your-pusher-app-id
   PUSHER_KEY=your-pusher-key
   PUSHER_SECRET=your-pusher-secret
   PUSHER_CLUSTER=your-pusher-cluster
   MONGODB_URI=your-mongodb-connection-string
   ```

   ```bash
   REACT_APP_PUSHER_KEY=
   REACT_APP_PUSHER_CLUSTER=
   ```

4. Build the React client:
   ```bash
   make build
   ```

5. Start the server:
   ```bash
   make dev
   ```

6. Visit `http://localhost:3000` in your browser to start chatting!

## Live Demo

Check out the live demo: [https://realtime-chat-green-five.vercel.app/](https://realtime-chat-green-five.vercel.app/)

## Improvements Needed

1. **Connection Security**:
   - The connection between the server and the client is not secured (no HTTPS or TLS).
   - Use secure WebSocket communication and enforce HTTPS on the server.

2. **Authentication**:
   - Currently, there is no token-based authentication.
   - Implement authentication to protect chat rooms, such as using **JWT** (JSON Web Token).

3. **User Validation**:
   - There is no user validation for sending or receiving messages.
   - Add user authentication and validation to ensure only authorized users can send and delete messages.

4. **Encryption**:
   - Messages are not encrypted during transmission.
   - Consider encrypting sensitive data to enhance security.

5. **Rate Limiting**:
   - No rate-limiting is implemented, which could expose the app to denial of service (DoS) attacks.
   - Implement rate-limiting on the server to prevent abuse.

6. **File Uploads**:
   - The app currently does not support sending images or file attachments.
   - Add support for file and image uploads with proper validation.

## License

This project is licensed under the MIT License.
