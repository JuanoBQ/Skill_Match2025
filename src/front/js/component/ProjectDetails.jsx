import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Modal, Button } from "react-bootstrap";

const ProjectDetails = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [proposalMessage, setProposalMessage] = useState("");
  const [proposedBudget, setProposedBudget] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/projects/${id}`);
        const data = await res.json();

        if (res.ok) {
          setProject(data);
        } else {
          console.error("Error cargando proyecto", data.msg);
        }
      } catch (error) {
        console.error("Error al conectar con el backend", error);
      }
    };

    fetchProject();
  }, [id]);

  const handleApply = async () => {
    if (!store.isAuthenticated) {
      alert("Debes estar logueado como freelancer.");
      navigate("/login");
      return;
    }

    const res = await actions.createProposal({
      project_id: project.id,
      freelancer_id: store.userId,
      message: proposalMessage,
      proposed_budget: proposedBudget
    });

    if (res.success) {
      setProposalMessage("");
      setProposedBudget("");
      setShowSuccessModal(true);
    } else {
      alert("Error al aplicar: " + res.error);
    }
  };

  if (!project) {
    return <div className="text-center mt-5">Cargando proyecto...</div>;
  }

  const employer = project.employer_info;

  return (
    <div className="container mt-5">
      <div className="card shadow rounded-4 p-4" style={{ backgroundColor: "#f9f9f9" }}>
        <h2 className="fw-bold text-primary mb-3">{project.title}</h2>

        <div className="mb-3">
          <p className="text-dark"><strong>Descripción:</strong> {project.description}</p>
        </div>

        {employer && (
          <div className="mb-3">
            <p><strong>Publicado por:</strong> {employer.first_name} {employer.last_name}</p>
            <p><strong>Email:</strong> {employer.email}</p>
            <p><strong>Calificación:</strong> ⭐ {employer.rating}</p>
          </div>
        )}

        <hr />

        <div className="row mb-3">
          <div className="col-md-4">
            <p><strong>Presupuesto estimado:</strong> ${project.budget}</p>
          </div>
          <div className="col-md-4">
            <p><strong>Categoría:</strong> {project.category}</p>
          </div>
          <div className="col-md-4">
            <p><strong>Ubicación:</strong> {project.location}</p>
          </div>
        </div>

        <div className="mb-3">
          <p><strong>Fecha límite:</strong> {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No especificada"}</p>
        </div>

        <div className="mb-4">
          <strong>Habilidades requeridas:</strong>
          <div className="mt-2">
            {project.skills.length > 0 ? (
              project.skills.map(skill => (
                <span key={skill.id} className="badge bg-dark text-light me-2 mb-1">{skill.name}</span>
              ))
            ) : (
              <span className="text-muted">No especificadas</span>
            )}
          </div>
        </div>

        <hr />

        {store.role === "freelancer" && (
          project.proposals.some(proposal => proposal.freelancer_id === Number(store.userId)) ? (
            <div className="alert alert-info fw-semibold">
              Ya has aplicado a esta oferta. 🙌
            </div>
          ) : (
            <div className="p-4 mt-4 rounded-3" style={{ backgroundColor: "#ffffff", boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
              <h5 className="fw-semibold mb-3 text-primary">Envía tu propuesta</h5>

              <div className="mb-3">
                <label htmlFor="proposalMessage" className="form-label fw-medium">Mensaje para el empleador</label>
                <textarea
                  id="proposalMessage"
                  className="form-control"
                  rows={4}
                  placeholder="Escribe un mensaje claro y profesional..."
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  style={{ borderRadius: "0.5rem" }}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="proposedBudget" className="form-label fw-medium">Presupuesto propuesto (USD)</label>
                <input
                  id="proposedBudget"
                  type="number"
                  className="form-control"
                  placeholder="Ej: 250"
                  value={proposedBudget}
                  onChange={(e) => setProposedBudget(e.target.value)}
                  style={{ borderRadius: "0.5rem" }}
                />
              </div>

              <div className="d-flex gap-3">
                <button className="btn btn-primary px-4" onClick={handleApply}>Aplicar a esta oferta</button>
                <button className="btn btn-outline-secondary ms-auto" onClick={() => navigate(-1)}>Volver</button>
              </div>
            </div>
          )
        )}

      </div>
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Body className="text-center py-5">
          <i
            className="bi bi-check-circle-fill text-success"
            style={{ fontSize: '4rem' }}
          ></i>
          <h4 className="mt-3">¡Solicitud Enviada!</h4>
          <p className="text-muted">
            Has aplicado con éxito a esta oferta.
          </p>
          <Button
            variant="success"
            onClick={() => {
              setShowSuccessModal(false);
              navigate(-1);
            }}
          >
            Aceptar
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
