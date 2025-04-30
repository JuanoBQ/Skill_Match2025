import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const EmployerProfile = () => {
    const navigate = useNavigate();
    const { actions } = useContext(Context);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [proposals, setProposals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showProposals, setShowProposals] = useState(false);
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

        const fetchProfile = async () => {
            const userId = localStorage.getItem("user_id");

            if (!userId) {
                console.error("No hay user_id en localStorage.");
                setLoading(false);
                return;
            }

            const response = await actions.getEmployerProfile(userId);

            if (response.success && response.profile) {
                setProfile(response.profile);
            } else {
                console.warn("Perfil incompleto o no encontrado, redirigiendo...");
                navigate("/employerForm");
            }

            setLoading(false);
        };

        fetchProfile();
        fetchProposals();
    }, [actions, navigate]);

    const handleCreateProject = async (e) => {
        e.preventDefault();

        const res = await actions.createProject({
            title,
            description,
            budget: parseFloat(budget),
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

    const handleEditProfile = () => {
        navigate("/employerForm");
    };

    if (loading) {
        return <div className="text-center mt-5">Cargando perfil...</div>;
    }

    if (!profile) {
        return <div className="text-center mt-5">Perfil no disponible</div>;
    }

    const fullName = profile.user?.first_name && profile.user?.last_name
        ? `${profile.user.first_name} ${profile.user.last_name}`
        : "Nombre no disponible";

    return (
        <div className="container mt-5" style={{ minHeight: "100vh" }}>
            <div className="text-center mb-5">
                <h2 className="fw-bold">Perfil del Empleador</h2>
                <div className="card mb-4 p-4">
                    <div className="d-flex align-items-center flex-column flex-md-row">
                        <img
                            src={profile.profile_picture || "https://via.placeholder.com/120"}
                            alt="Foto de perfil"
                            className="rounded-circle me-md-4 mb-3 mb-md-0"
                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                        />

                        <div className="text-center text-md-start flex-grow-1">
                            <h4>{fullName}</h4>
                            <p className="text-muted mb-1">{profile.user?.email}</p>
                            <p className="mb-2">
                                <strong>Descripción:</strong> {profile.bio || "Sin descripción aún."}
                            </p>
                        </div>

                        <div className="text-center text-md-end">
                            <button className="btn btn-outline-primary" onClick={handleEditProfile}>
                                Editar perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACCIONES */}
            <div className="d-flex justify-content-center gap-3 mb-4">
                <button
                    className="btn btn-dark"
                    onClick={() => setShowForm((prev) => !prev)}
                >
                    {showForm ? "Cancelar" : "Crear nueva oferta"}
                </button>

                <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowProposals((prev) => !prev)}
                >
                    {showProposals ? "Ocultar solicitudes" : "Ver solicitudes recibidas"}
                </button>
            </div>

            {/* FORMULARIO CREAR OFERTA */}
            {showForm && (
                <div className="card shadow mb-4">
                    <div className="card-body">
                        <h5 className="mb-4">Nueva Oferta de Trabajo</h5>
                        <form onSubmit={handleCreateProject}>
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
                                ></textarea>
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
                    </div>
                </div>
            )}

            {/* SOLICITUDES RECIBIDAS */}
            {showProposals && (
                <div className="card shadow mb-5">
                    <div className="card-body">
                        <h5 className="mb-4 text-center">Solicitudes Recibidas</h5>

                        {proposals.length > 0 ? (
                            proposals.map((proposal) => (
                                <div key={proposal.id} className="border rounded p-3 mb-3">
                                    <h6>Proyecto: {proposal.project?.title || "Proyecto desconocido"}</h6>
                                    <p><strong>Freelancer:</strong> {proposal.freelancer?.first_name} {proposal.freelancer?.last_name}</p>
                                    <p><strong>Mensaje:</strong> {proposal.message}</p>
                                    <p><strong>Presupuesto:</strong> ${proposal.proposed_budget}</p>
                                    <button
                                        className="btn btn-sm btn-outline-success w-100"
                                        onClick={() => handleHire(proposal.id)}
                                    >
                                        Contratar
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted">Aún no has recibido propuestas.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerProfile;