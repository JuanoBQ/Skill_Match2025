import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import styles from './../../styles/index.css';

const DashboardProjects = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [proposalMessage, setProposalMessage] = useState("");
    const [proposedBudget, setProposedBudget] = useState("");

    useEffect(() => {
        actions.getProjects();
    }, []);

    const handleViewOffer = (project) => {
        if (!store.isAuthenticated) {
            alert("Debes estar logueado como freelancer para ver y aplicar a una oferta.");
            navigate("/login");
            return;
        }

        setSelectedProject(project);
        setShowModal(true);
    };

    const handleApply = async () => {
        if (!store.isAuthenticated) {
            alert("Debes estar logueado como freelancer.");
            navigate("/login");
            return;
        }

        const res = await actions.createProposal({
            project_id: selectedProject.id,
            freelancer_id: store.userId,
            message: proposalMessage,
            proposed_budget: proposedBudget
        });

        if (res.success) {
            alert("Aplicaste exitosamente a la oferta.");
            setShowModal(false);
            setProposalMessage("");
            setProposedBudget("");
        } else {
            alert("Error al aplicar: " + res.error);
        }
    };

    const readMore = (bio) => {
        if (!bio) return "No Bio";
        return bio.length > 500 ? bio.slice(0, 500) + "..." : bio;
    };

    const filteredProfiles = store.projects.filter(project =>
        (!store.filters.skills || project.skills?.some(skill => skill.name === store.filters.skills)) &&
        (!store.filters.category || project.category === store.filters.category) &&
        (!store.filters.rating || project.rating >= parseInt(store.filters.rating)) &&
        (!store.filters.location || project.location === store.filters.location)
    );

    return (
        <div className="container-fluid justify-content-center mt-5">
            {store.projects.length > 0 ? (
                <div>
                    {filteredProfiles.map((project) => (
                        <div key={project.id}>
                            <div className="card mb-4 shadow-sm Project-card" style={{ width: '100%', borderRadius: '15px' }}>
                                <div className="row no-gutters">
                                    <div className="card-body-info">
                                        <div className="card-body p-4">

                                            <h5 className="card-title fs-4 fw-bold text-dark">{project.title}</h5>
                                            <p className="card-text text-muted mb-2"><i className="bi bi-briefcase-fill"></i> {project.category}</p>
                                            <p className="card-text text-muted mb-3">{readMore(project.description)}</p>
                                            <div className="d-flex justify-content-between text-muted">
                                                <p className="card-text"><i className="bi bi-calendar-event"></i> Publicado: {new Date(project.created_at).toLocaleDateString()}</p>
                                                <p className="card-text"><i className="bi bi-calendar-check"></i> Fecha límite: {new Date(project.deadline).toLocaleDateString()}</p>
                                            </div>
                                            <p className="card-text text-muted mb-3"><i className="bi bi-geo-alt"></i> Ubicación: {project.location}</p>
                                            <p className="card-text text-muted mb-3">
                                                <i className="bi bi-gear-fill"></i> Habilidades requeridas:
                                                <div className="mt-2">
                                                    {project.skills?.map(skill => (
                                                        <span key={skill.id} className="badge bg-dark me-2 rounded-pill">{skill.name}</span>
                                                    ))}
                                                </div>
                                            </p>
                                            <p className="card-text text-muted mb-2"><i className="bi bi-file-earmark-check"></i> Status: {project.status}</p>
                                            {project.status==="open"? (<button className="btn btn-primary btn-md mt-3 w-100" onClick={() => handleViewOffer(project)}>
                                                Ver Oferta
                                            </button>): "Oferta Expirada"}
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <div>No se encontraron ofertas</div>
            )}

            {/* MODAL  */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProject?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Descripción:</strong> {selectedProject?.description}</p>
                    <p><strong>Presupuesto estimado:</strong> ${selectedProject?.budget}</p>
                    <p><strong>Categoría:</strong> {selectedProject?.category}</p>
                    <p><strong>Ubicación:</strong> {selectedProject?.location}</p>
                    <p><strong>Fecha límite:</strong> {new Date(selectedProject?.deadline).toLocaleDateString()}</p>
                    <p><strong>Publicado por:</strong> {selectedProject?.employer_info?.first_name} {selectedProject?.employer_info?.last_name} ({selectedProject?.employer_info?.email})</p>
                    <p><strong>Calificacion:</strong> ⭐ {selectedProject?.employer_info?.rating}</p>
                    <p><strong>Habilidades requeridas:</strong>
                        {selectedProject?.skills?.map(skill => (
                            <span key={skill.id} className="badge bg-primary ms-2">{skill.name}</span>
                        ))}
                    </p>

                    <textarea
                        className="form-control mb-3"
                        placeholder="Mensaje para el empleador..."
                        value={proposalMessage}
                        onChange={(e) => setProposalMessage(e.target.value)}
                    />

                    <input
                        type="number"
                        className="form-control"
                        placeholder="Tu presupuesto propuesto (USD)"
                        value={proposedBudget}
                        onChange={(e) => setProposedBudget(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleApply}>
                        Aplicar a esta oferta
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DashboardProjects;
