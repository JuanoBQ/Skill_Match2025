import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const EmployerProfile = () => {
    const navigate = useNavigate();
    const { actions } = useContext(Context);

    // Estados
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState("");
    const [stats, setStats] = useState({
        offers: 0,
        proposals: 0,
        completed: 0,
        rating: 0,
    });
    const [offers, setOffers] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showProposals, setShowProposals] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            console.error("No hay user_id en localStorage.");
            setLoading(false);
            return;
        }

        const loadAll = async () => {
            // Perfil
            const profileRes = await actions.getEmployerProfile(userId);
            if (profileRes.success) {
                setProfile(profileRes.profile);
                const stored = localStorage.getItem("profile_picture");
                setProfileImage(
                    stored ||
                    profileRes.profile.profile_picture ||
                    "https://via.placeholder.com/120"
                );
            } else {
                navigate("/employerForm");
                return;
            }

            // Estadísticas
            const statsRes = await actions.getEmployerStats();
            if (statsRes.success) {
                setStats(statsRes.stats);
            }

            // Ofertas activas
            const projRes = await actions.getEmployerProjects();
            if (projRes.success) {
                setOffers(projRes.projects);
            }

            // Propuestas
            const propsRes = await actions.getEmployerProposals(userId);
            if (propsRes.success) {
                setProposals(propsRes.proposals);
            }

            // Skills
            const skillsRes = await actions.getSkills();
            if (skillsRes.success) {
                setAvailableSkills(
                    skillsRes.skills.map((s) => ({ value: s.id, label: s.name }))
                );
            }

            setLoading(false);
        };

        loadAll();
    }, [actions, navigate]);

    const handleEditProfile = () => navigate("/employerForm");

    const handleCreateProject = async (e) => {
        e.preventDefault();
        const res = await actions.createProject({
            title,
            description,
            budget: parseFloat(budget),
            skills: selectedSkills.map((s) => s.value),
        });
        if (res.success) {
            alert("Oferta creada exitosamente.");
            setShowForm(false);
            setTitle("");
            setDescription("");
            setBudget("");
            setSelectedSkills([]);
            // refrescar ofertas y stats
            const statsRes = await actions.getEmployerStats();
            if (statsRes.success) setStats(statsRes.stats);
            const projRes = await actions.getEmployerProjects();
            if (projRes.success) setOffers(projRes.projects);
        } else {
            alert("Error al crear la oferta: " + res.error);
        }
    };

    const handleHire = (id) => navigate(`/payment/${id}`);

    const handlePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageUrl = reader.result;
            const userId = localStorage.getItem("user_id");
            const res = await actions.uploadEmployerPicture(userId, imageUrl);
            if (res.success) {
                setProfileImage(imageUrl);
                alert("Foto actualizada");
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading)
        return <div className="text-center mt-5">Cargando perfil...</div>;
    if (!profile)
        return <div className="text-center mt-5">Perfil no encontrado.</div>;

    const fullName = `${profile.user?.first_name} ${profile.user?.last_name}`;

    return (
        <div className="container mt-5" style={{ minHeight: "100vh" }}>
            {/* Header */}
            <div className="text-center mb-5">
                <h2 className="fw-bold">Perfil del Empleador</h2>
                <div className="card mb-4 p-4">
                    <div className="d-flex align-items-center flex-column flex-md-row">
                        {/* Foto */}
                        <div className="position-relative me-md-4 mb-3 mb-md-0">
                            <img
                                src={profileImage}
                                alt="Foto de perfil"
                                className="rounded-circle"
                                style={{ width: 120, height: 120, objectFit: "cover" }}
                            />
                        </div>
                        {/* Datos */}
                        <div className="text-center text-md-start flex-grow-1">
                            <h4>{fullName}</h4>
                            <p className="text-muted mb-1">{profile.user?.email}</p>
                            <p className="mb-2">
                                <strong>Descripción:</strong> {profile.bio || "Sin descripción."}
                            </p>
                            <p className="mb-1">
                                <strong>Industria:</strong> {profile.industry || "No especificada"}
                            </p>
                            <p className="mb-1">
                                <strong>Ubicación:</strong> {profile.location || "No especificada"}
                            </p>
                            {profile.website && (
                                <p className="mb-1">
                                    <strong>Web:</strong>{" "}
                                    <a href={profile.website} target="_blank" rel="noreferrer">
                                        {profile.website}
                                    </a>
                                </p>
                            )}
                            {profile.phone && (
                                <p className="mb-1">
                                    <strong>Teléfono:</strong> {profile.phone}
                                </p>
                            )}
                        </div>
                        {/* Editar */}
                        <div className="text-center text-md-end">
                            <button className="btn btn-outline-primary" onClick={handleEditProfile}>
                                Editar perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div className="d-flex justify-content-center gap-3 mb-4">
                <button className="btn btn-dark" onClick={() => setShowForm((f) => !f)}>
                    {showForm ? "Cancelar" : "Crear nueva oferta"}
                </button>
                <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowProposals((p) => !p)}
                >
                    {showProposals ? "Ocultar solicitudes" : "Ver solicitudes recibidas"}
                </button>
            </div>

            {/* Estadísticas */}
            <div className="row mb-5">
                {[
                    { label: "Ofertas publicadas", value: stats.offers },
                    { label: "Propuestas recibidas", value: stats.proposals },
                    { label: "Proyectos completados", value: stats.completed },
                    { label: "Valoración promedio", value: `${stats.rating.toFixed(1)}★` },
                ].map((s, i) => (
                    <div key={i} className="col-md-3 mb-3">
                        <div className="card text-center h-100">
                            <div className="card-body">
                                <h5 className="card-title">{s.value}</h5>
                                <p className="card-text text-muted">{s.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Formulario de nueva oferta */}
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
                                    placeholder="Descripción"
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
                            <div className="mb-3">
                                <label className="form-label">Habilidades requeridas</label>
                                <Select
                                    isMulti
                                    options={availableSkills}
                                    value={selectedSkills}
                                    onChange={setSelectedSkills}
                                    placeholder="Selecciona las habilidades"
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-100">
                                Publicar proyecto
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Ofertas activas */}
            <div className="mb-5">
                <h4>Ofertas activas</h4>
                {offers.length > 0 ? (
                    <div className="row">
                        {offers.map((o) => (
                            <div key={o.id} className="col-md-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-body d-flex flex-column">
                                        <h5>{o.title}</h5>
                                        <p className="mb-1">
                                            <strong>Presupuesto:</strong> ${o.budget}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Publicada:</strong>{" "}
                                            {new Date(o.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-muted mt-auto">
                                            {o.proposals_count} postulantes
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted">No hay ofertas activas.</p>
                )}
            </div>

            {/* Solicitudes recibidas */}
            {showProposals && (
                <div className="card shadow mb-5">
                    <div className="card-body">
                        <h5 className="mb-4 text-center">Solicitudes Recibidas</h5>
                        {proposals.length > 0 ? (
                            proposals.map((p) => (
                                <div key={p.id} className="border rounded p-3 mb-3">
                                    <h6>Proyecto: {p.project?.title || "Sin título"}</h6>
                                    <p>
                                        <strong>Freelancer:</strong> {p.freelancer?.first_name}{" "}
                                        {p.freelancer?.last_name}
                                    </p>
                                    <p>
                                        <strong>Mensaje:</strong> {p.message}
                                    </p>
                                    <p>
                                        <strong>Oferta:</strong> ${p.proposed_budget}
                                    </p>
                                    <button
                                        className="btn btn-sm btn-outline-success w-100"
                                        onClick={() => handleHire(p.id)}
                                    >
                                        Contratar
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted">
                                Aún no has recibido propuestas.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerProfile;
