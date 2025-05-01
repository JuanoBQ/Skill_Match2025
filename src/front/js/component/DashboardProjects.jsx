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

    return (
        <div className="container-fluid d-flex justify-content-center mt-5">
            {store.projects && store.projects.length > 0 ? (
                <div>
                    {store.projects.map((project) => (
                        <div key={project.id}>
                            <div className="card mb-3 Project-card" style={{ width: '800px' }}>
                                <div className="ms-3 row no-gutters">
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{project.title}</h5>
                                            <p className="card-text"><small className="text-muted">{project.category}</small></p>
                                            <p className="card-text">{project.description}</p>
                                            <p className="card-text"><small className="text-muted">Publicado: {project.created_at}</small></p>
                                            <p className="card-text"><small className="text-muted">Status: {project.status}</small></p>
                                            <button className="btn btn-info" onClick={() => handleViewOffer(project)}>
                                                Ver Oferta
                                            </button>
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

            {/* MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProject?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Descripción:</strong> {selectedProject?.description}</p>
                    <p><strong>Presupuesto estimado:</strong> ${selectedProject?.budget}</p>

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
