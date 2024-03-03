import React, { useState, useEffect } from 'react';
import './App.css';

import { ChatClient } from './rpc_script/chat_pb2_service';
import { Message } from './rpc_script/chat_pb2.py';

const client = new ChatClient('http://localhost:50051');

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    const stream = client.sendMessageStream();
    stream.on('data', (response) => {
      const newMessage = response.toObject();
      setMessages([...messages, newMessage]);
    });
    return () => stream.cancel();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = new Message();
    message.setUser(user);
    message.setText(text);
    client.sendMessage(message, null, (err, response) => {
      if (err) {
        console.error('Error sending message:', err);
      }
      setText('');
    });
  };

  return (
    <div className="App">
      <h1>Chat App</h1>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="message">
            <strong>{msg.user}: </strong>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="Enter your name" required />
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your message" required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
