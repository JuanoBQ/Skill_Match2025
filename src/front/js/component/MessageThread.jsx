import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";

const MessageThread = ({ otherId, otherName }) => {
  const { actions } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  
  useEffect(() => {
    const fetchConversation = async () => {
      const res = await actions.getConversation(otherId);
      if (res.success) setMessages(res.messages);
    };
    fetchConversation();
  }, [otherId, actions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;  

    const res = await actions.sendMessage({
      recipient_id: otherId,
      content: newMsg.trim(),
    });
    if (res.success) {
    
      setMessages((prev) => [...prev, res.message]);
      setNewMsg("");
    } else {
      alert(res.error);
    }
  };

  return (
    <div>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "8px",
          marginBottom: "8px",
        }}
      >
        {messages.map((m) => (
          <div key={m.id} style={{ margin: "6px 0" }}>
            <strong>
              {m.from === otherId ? otherName : "Tú"}:
            </strong>{" "}
            {m.content}
            <br />
            <small className="text-muted">
              {new Date(m.timestamp).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Escribe tu mensaje…"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default MessageThread;