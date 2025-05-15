import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";

const MessageThread = ({ otherId, otherName }) => {
  const { actions } = useContext(Context);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchConversation = async () => {
      const res = await actions.getConversation(otherId);
      if (res.success) setMessages(res.messages);
    };
    fetchConversation();
  }, [otherId, actions]);

  return (
    <>
      {messages.map((m) => (
        <div key={m.id} style={{ margin: "0.5rem 0" }}>
          <strong>{m.from === otherId ? otherName : "Tú"}:</strong>{" "}
          {m.content}
          <br />
          <small className="text-muted">
            {new Date(m.timestamp).toLocaleString()}
          </small>
        </div>
      ))}
    </>
  );
};

export default MessageThread;
