import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const EmployerProfile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [proposals, setProposals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");

    useEffect(() => {
        const fetchProposals = async () => {
            const employerId = localStorage.getItem("user_id");
            const res = await actions.getEmployerProposals(employerId);

            if (res.success) {
                setProposals(res.proposals);
            } else {
                console.error("Error cargando propuestas:", res.error);
            }
        };

        fetchProposals();
    }, [actions]);

    const handleCreateProject = async (e) => {
        e.preventDefault();

        const res = await actions.createProject({
            title,
            description,
            budget: parseFloat(budget)
        });

        if (res.success) {
            alert("Oferta laboral creada exitosamente.");
            setShowForm(false);
            setTitle("");
            setDescription("");
            setBudget("");
        } else {
            alert("Error al crear Oferta laboral: " + res.error);
        }
    };

    const handleHire = (proposalId) => {
        navigate(`/payment/${proposalId}`);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Perfil del Empleador</h2>

            {/* Crear nueva oferta */}
            <div className="card mb-5">
                <div className="card-body text-center">
                    <button className="btn btn-dark" onClick={() => setShowForm(!showForm)}>
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

            {/* Solicitudes recibidas */}
            <div className="card">
                <div className="card-body">
                    <h4 className="text-center mb-4">Solicitudes Recibidas</h4>

                    {proposals.length > 0 ? (
                        proposals.map((proposal) => (
                            <div key={proposal.id} className="border p-3 mb-3">
                                <h5>Proyecto: {proposal.project?.title || "Proyecto desconocido"}</h5>
                                <p><strong>Freelancer:</strong> {proposal.freelancer?.first_name || "N/A"} {proposal.freelancer?.last_name || ""}</p>
                                <p><strong>Mensaje:</strong> {proposal.message}</p>
                                <p><strong>Presupuesto propuesto:</strong> ${proposal.proposed_budget}</p>
                                <button className="btn btn-success w-100" onClick={() => handleHire(proposal.id)}>
                                    Contratar
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">Aún no has recibido propuestas.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;