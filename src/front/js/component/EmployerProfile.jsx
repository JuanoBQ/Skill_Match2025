import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

const EmployerProfile = () => {
  const { actions } = useContext(Context);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const handleCreateProject = async (e) => {
    e.preventDefault();

    const res = await actions.createProject({
      title,
      description,
      budget: parseFloat(budget)
    });

    if (res.success) {
      alert("Oferta de trabajo creada exitosamente.");
      setShowForm(false);
      setTitle("");
      setDescription("");
      setBudget("");
    } else {
      alert("Error al crear oferta laboral: " + res.error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Perfil del Empleador</h2>

      <div className="card">
        <div className="card-body text-center">
          <h4>Nombre Empleador</h4>

          <button className="btn btn-dark mt-4" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : "Crear nueva oferta"}
          </button>

          {showForm && (
            <form className="mt-4" onSubmit={handleCreateProject}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Título del proyecto"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Descripción del proyecto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Presupuesto (USD)"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success w-100">
                Publicar proyecto
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;