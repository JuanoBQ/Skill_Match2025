import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import MessageThread from "./MessageThread.jsx";

const ChatAccordion = () => {
  const { actions } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeName, setActiveName] = useState("");

  // 1) Carga la lista de conversaciones
  useEffect(() => {
    async function load() {
      const res = await actions.getConversations();
      if (res.success) setList(res.conversations);
    }
    load();
  }, [actions]);

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
        <div
          className="list-group mb-3"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          {list.length > 0
            ? list.map((c) => (
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
            : <div className="list-group-item text-muted">No tienes conversaciones</div>
          }
        </div>
      )}

      {/* Modal centrado al seleccionar un chat */}
      {activeChat && (
        <>
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Chat con {activeName}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setActiveChat(null)}
                  />
                </div>
                <div className="modal-body">
                  <MessageThread otherId={activeChat} otherName={activeName} />
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