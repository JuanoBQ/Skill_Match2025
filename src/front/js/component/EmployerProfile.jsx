import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import undefinedImg from "./../../../front/img/User_Undefined.jpg";

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
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");
    const [location, setLocation] = useState("");

    const [completedProjects, setCompletedProjects] = useState([]);

    // ——— Estados para el modal de calificación ———
    const [modalOpen, setModalOpen] = useState(false);
    const [currentProposal, setCurrentProposal] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

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
                    undefinedImg
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

            // Ofertas de trabajo activas
            const projRes = await actions.getEmployerProjects();
            if (projRes.success) {
                setOffers(projRes.projects);
            }

            // Solicitudes
            const propsRes = await actions.getEmployerProposals(userId);
            if (propsRes.success) {
                setProposals(propsRes.proposals);
            }

            const completedRes = await actions.getCompletedProjects();
            if (completedRes.success) {
                setCompletedProjects(completedRes.projects);
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
        console.log("Payload enviado al backend:", {
            title,
            description,
            budget: parseFloat(budget),
            skills: selectedSkills.map((s) => s.value),
            category: category?.value,
            deadline,
            location: location?.value
        });
        const res = await actions.createProject({
            title,
            description,
            budget: parseFloat(budget),
            skills: selectedSkills.map((s) => s.value),
            category: category?.value,
            deadline,
            location: location?.value
        });
        if (res.success) {
            alert("Oferta creada exitosamente.");
            setShowForm(false);
            setTitle("");
            setDescription("");
            setBudget("");
            setSelectedSkills([]);
            setCategory("");
            setDeadline("");
            setLocation("")

            const statsRes = await actions.getEmployerStats();
            if (statsRes.success) setStats(statsRes.stats);
            const projRes = await actions.getEmployerProjects();
            if (projRes.success) setOffers(projRes.projects);
        } else {
            alert("Error al crear la oferta: " + res.error);
        }
    };

    const handleHire = (id) => navigate(`/payment/${id}`);

    const handleOpenReview = (proposal) => {
        setCurrentProposal(proposal);
        setRating(0);
        setComment("");
        setModalOpen(true);
    };

    // ——— Enviar review ———
    const submitReview = async () => {
        const payload = {
            proposal_id: currentProposal.id,
            reviewee_id: currentProposal.freelancer.id,
            rating,
            comment,
        };
        const resp = await actions.createReview(payload);
        if (resp.success) {
            // marcar como calificado en la lista de proposals
            setProposals((prev) =>
                prev.map((p) =>
                    p.id === currentProposal.id ? { ...p, reviewed: true } : p
                )
            );
            setModalOpen(false);
        } else {
            alert(resp.msg);
        }
    };

    if (loading)
        return <div className="text-center mt-5">Cargando perfil...</div>;
    if (!profile)
        return <div className="text-center mt-5">Perfil no encontrado.</div>;

    const fullName = `${profile.user?.first_name} ${profile.user?.last_name}`;

    return (
        <div className="container mt-5 animate__animated animate__fadeIn" style={{ minHeight: "100vh" }}>
            <div className="row mb-5">
                <div className="col">

                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="row g-0">
                            <div className="col-md-4 bg-light text-center text-md-start py-4 px-3">
                                <img
                                    src={profileImage}
                                    alt="Foto de perfil"
                                    className="rounded-circle shadow-sm border mb-3"
                                    style={{ width: 120, height: 120, objectFit: "cover" }}
                                />
                                <h4 className="fw-bold mb-1">{fullName}</h4>
                                <p className="text-secondary mb-3">{profile.user?.email}</p>

                                <p className="mb-2">
                                    <strong>Industria:</strong><br />
                                    {profile.industry || <span className="text-muted">No especificada</span>}
                                </p>
                                <p className="mb-2">
                                    <strong>Ubicación:</strong><br />
                                    {profile.location || <span className="text-muted">No especificada</span>}
                                </p>
                                {profile.website && (
                                    <p className="mb-2">
                                        <strong>Web:</strong><br />
                                        <a href={profile.website} target="_blank" rel="noreferrer">
                                            {profile.website}
                                        </a>
                                    </p>
                                )}
                                {profile.phone && (
                                    <p className="mb-0">
                                        <strong>Teléfono:</strong><br />
                                        {profile.phone}
                                    </p>
                                )}
                            </div>

                            <div className="col-md-8">
                                <div className="p-4" style={{ whiteSpace: 'pre-line' }}>
                                    <div className="d-flex justify-content-end mb-3">
                                        <button
                                            className="btn btn-outline-primary rounded-pill px-4"
                                            onClick={handleEditProfile}
                                        >
                                            Editar perfil
                                        </button>
                                    </div>
                                    <h5 className="fw-bold">Descripción</h5>
                                    <p className="text-justify"> {profile.bio || <span className="text-muted">Sin descripción.</span>}</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="d-flex justify-content-center gap-3 mt-5 mb-4">
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


                    {showForm && (
                        <div className="card shadow mt-4 mb-4">
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
                                        <label className="form-label">Categoría</label>
                                        <Select
                                            options={[
                                                { value: 'Web Developer', label: 'Web Developer' },
                                                { value: 'Graphic Designer', label: 'Graphic Designer' },
                                                { value: 'Ui Ux designer', label: 'UI/UX Designer' },
                                                { value: 'Mobile Developer', label: 'Mobile App Developer' },
                                                { value: 'Data Scientist', label: 'Data Scientist' },
                                                { value: 'Software Engineer', label: 'Software Engineer' },
                                                { value: 'Backend Developer', label: 'Backend Developer' },
                                                { value: 'Frontend Developer', label: 'Frontend Developer' },
                                                { value: 'Fullstack Developer', label: 'Fullstack Developer' },
                                                { value: 'Devops Engineer', label: 'DevOps Engineer' },
                                                { value: 'Content Writer', label: 'Content Writer' },
                                                { value: 'Copywriter', label: 'Copywriter' },
                                                { value: 'Seo Specialist', label: 'SEO Specialist' },
                                                { value: 'Digital Marketer', label: 'Digital Marketer' },
                                                { value: 'video Editor', label: 'Video Editor' },
                                                { value: 'Photographer', label: 'Photographer' },
                                                { value: 'Illustrator', label: 'Illustrator' },
                                                { value: 'Translator', label: 'Translator' },
                                                { value: 'Virtual assistant', label: 'Virtual Assistant' },
                                                { value: 'Project manager', label: 'Project Manager' }
                                            ]}
                                            value={category}
                                            onChange={setCategory}
                                            placeholder="Selecciona una categoría"
                                        />
                                    </div>


                                    <div className="mb-3">
                                        <label className="form-label">Fecha de entrega o expiración</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={deadline}
                                            onChange={(e) => setDeadline(e.target.value)}
                                        />
                                    </div>


                                    <div className="mb-3">
                                        <label className="form-label">Ubicación del proyecto</label>
                                        <Select
                                            options={[
                                                { value: 'Argentina', label: 'Argentina' },
                                                { value: 'Bolivia', label: 'Bolivia' },
                                                { value: 'Brasil', label: 'Brasil' },
                                                { value: 'Chile', label: 'Chile' },
                                                { value: 'Colombia', label: 'Colombia' },
                                                { value: 'Ecuador', label: 'Ecuador' },
                                                { value: 'Paraguay', label: 'Paraguay' },
                                                { value: 'Peru', label: 'Perú' },
                                                { value: 'Uruguay', label: 'Uruguay' },
                                                { value: 'Venezuela', label: 'Venezuela' },
                                                { value: 'Remoto', label: 'Remoto' }
                                            ]}
                                            value={location}
                                            onChange={setLocation}
                                            placeholder="Selecciona la ubicación"
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



                    <div className="mb-5">
                        <h4>Ofertas de Trabajo Activas</h4>
                        {offers.length > 0 ? (
                            <div className="row">
                                {offers.map((o) => (
                                    <div key={o.id} className="col-sm-6 col-lg-4 mb-3">
                                        <div className="card h-100 p-2">
                                            <div className="card-body d-flex flex-column">
                                                <h6 className="mb-2">{o.title}</h6>
                                                <p className="small mb-1">
                                                    <strong>Presupuesto:</strong> ${o.budget}
                                                </p>
                                                <p className="small mb-1">
                                                    <strong>Publicada:</strong>{" "}
                                                    {new Date(o.created_at).toLocaleDateString()}
                                                </p>
                                                <p className="text-muted mt-auto small">
                                                    {o.proposals_count} postulantes
                                                </p>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger mt-2"
                                                    onClick={async () => {
                                                        const ok = window.confirm("¿Estás seguro de que quieres eliminar esta oferta?");
                                                        if (!ok) return;

                                                        const res = await actions.deleteProject(o.id);
                                                        if (res.success) {
                                                            const proj = await actions.getEmployerProjects();
                                                            if (proj.success) setOffers(proj.projects);
                                                        } else {
                                                            alert("Error al eliminar: " + res.error);
                                                        }
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted">No hay ofertas de trabajo activas.</p>
                        )}
                    </div>


                    {showProposals && (
                        <div className="card shadow mt-4 mb-5">
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
                
                <div className="col-auto d-flex flex-column gap-3 align-items-end">
                    {[
                        { label: "Trabajos publicados", value: stats.offers },
                        { label: "Propuestas recibidas", value: stats.proposals },
                        { label: "Trabajos completados", value: completedProjects.length },
                        { label: "Valoración", value: `${stats.rating.toFixed(1)}★` },
                    ].map((s, i) => (
                        <div
                            key={i}
                            className="card text-center"
                            style={{
                                width: '18vh',
                                height: '18vh',
                            }}
                        >
                            <div
                                className="card-body d-flex flex-column justify-content-center align-items-center"
                            >
                                <h5 className="card-title mb-1">{s.value}</h5>
                                <p className="card-text text-muted mb-0">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



            <div className="mt-4">
                <details>
                    <summary className="fw-bold">
                        Proyectos completados ({proposals.filter(p => p.status === "completed").length})
                    </summary>
                    <ul className="list-group mt-2">
                        {proposals
                            .filter(p => p.status === "completed")
                            .map((p) => (
                                <li
                                    key={p.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <strong>{p.project.title}</strong>
                                        <br />
                                        Freelancer: {p.freelancer.first_name} {p.freelancer.last_name}
                                    </div>

                                    {p.reviewed ? (
                                        <span className="badge bg-success">Calificado</span>
                                    ) : (
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => handleOpenReview(p)}
                                        >
                                            Calificar
                                        </button>
                                    )}
                                </li>
                            ))}
                    </ul>
                </details>
            </div>


            {modalOpen && (
                <div className="modal-backdrop d-flex justify-content-center align-items-center">
                    <div className="modal-content p-4" style={{ maxWidth: 400, width: "100%" }}>
                        <h5 className="mb-3">Calificar a {currentProposal.freelancer.first_name}</h5>
                        <div className="mb-3">
                            {[1, 2, 3, 4, 5].map(n => (
                                <span
                                    key={n}
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "1.5rem",
                                        color: n <= rating ? "#ffc107" : "#e4e5e9"
                                    }}
                                    onClick={() => setRating(n)}
                                >★</span>
                            ))}
                        </div>
                        <textarea
                            className="form-control mb-3"
                            rows={3}
                            placeholder="Comentario (opcional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-secondary me-2" onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={submitReview} disabled={rating === 0}>Enviar</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EmployerProfile;