import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";

const MessageThread = ({ otherId, otherName, reloadFlag }) => {
  const { actions } = useContext(Context);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchConversation = async () => {
      const res = await actions.getConversation(otherId);
      if (res.success) setMessages(res.messages);
    };
    fetchConversation();
  }, [otherId, actions, reloadFlag]);

  return (
    <div className="message-list">
      {messages.map((m) => {
        const isSent = m.from !== otherId;
        return (
          <div
            key={m.id}
            className={`message ${isSent ? "sent" : "received"}`}
          >
            <div className="bubble">
              <strong>{isSent ? "Tú" : otherName}:</strong> {m.content}
            </div>
            <small className="timestamp">
              {new Date(m.timestamp).toLocaleString()}
            </small>
          </div>
        );
      })}
    </div>
  );
};

export default MessageThread;