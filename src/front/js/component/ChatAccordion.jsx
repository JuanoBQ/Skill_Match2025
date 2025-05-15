import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import MessageThread from "./MessageThread.jsx";
import "../../styles/ChatAccordion.css";
import pattern from "../../img/chat-pattern.png";

const ChatAccordion = () => {
  const { actions } = useContext(Context);

  // Estado acordeón y lista de conversaciones
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);

  // Chat activo
  const [activeChat, setActiveChat] = useState(null);
  const [activeName, setActiveName] = useState("");

  // Nuevo mensaje
  const [newMessage, setNewMessage] = useState("");
  const [reloadFlag, setReloadFlag] = useState(0);

  // Carga la lista de conversaciones
  useEffect(() => {
    async function load() {
      const res = await actions.getConversations();
      if (res.success) setList(res.conversations);
    }
    load();
  }, [actions]);

  // Envía el mensaje y limpia input
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const res = await actions.sendMessage({
      recipient_id: activeChat,
      content: newMessage
    });
    if (res.success) {
      setNewMessage("");
      setReloadFlag(f => f + 1);
      // Opcional: si MessageThread no refresca automáticamente,
      // podrías disparar aquí una recarga de mensajes.
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Botón acordeón */}
      <button
        className="btn btn-outline-secondary w-100 mb-2 d-flex align-items-center justify-content-center"
        onClick={() => setOpen((o) => !o)}
      >
        <i className="bi bi-envelope-fill me-2"></i>
        Mensajes
        <i className={`bi ms-auto ${open ? "bi-caret-up-fill" : "bi-caret-down-fill"}`}></i>
      </button>

      {/* Lista de contactos */}
      {open && (
        <div className="list-group mb-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
          {list.length > 0 ? (
            list.map((c) => (
              <button
                key={c.user_id}
                className="list-group-item list-group-item-action"
                onClick={() => {
                  setActiveChat(c.user_id);
                  setActiveName(c.name);
                }}
              >
                <i className="bi bi-person-circle me-2"></i>
                {c.name}
              </button>
            ))
          ) : (
            <div className="list-group-item text-muted">No tienes conversaciones</div>
          )}
        </div>
      )}

      {/* Modal centrado al seleccionar un chat */}
      {activeChat && (
        <>
          <div className="modal d-block" tabIndex={-1}>
            {/* Agregamos modal-dialog-scrollable */}
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">

                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title">Chat con {activeName}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setActiveChat(null)}
                  />
                </div>

                {/* Body: flex column */}
                <div className="modal-body p-0 d-flex flex-column">

                  {/* Mensajes: patrón + scroll interno */}
                  <div
                    className="chat-body flex-grow-1"
                    style={{
                      backgroundImage: `url(${pattern})`,
                      backgroundRepeat: "repeat",
                      overflowY: "auto",
                      maxHeight: "60vh"
                    }}
                  >
                    <MessageThread
                      otherId={activeChat}
                      otherName={activeName}
                      reloadFlag={reloadFlag}
                    />
                  </div>

                  {/* Footer: input + botón */}
                  <div className="chat-footer p-3 border-top">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Escribe tu mensaje…"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      />
                      <button className="btn btn-primary" onClick={handleSend}>
                        Enviar
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default ChatAccordion;