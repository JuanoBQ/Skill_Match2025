import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const EmployerProfile = () => {
    const navigate = useNavigate();
    const { actions } = useContext(Context);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState("");
    const [proposals, setProposals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showProposals, setShowProposals] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = localStorage.getItem("user_id");
            if (!userId) {
                console.error("No hay user_id en localStorage.");
                setLoading(false);
                return;
            }

            const res = await actions.getEmployerProfile(userId);
            if (res.success && res.profile && res.profile.bio !== null) {
                setProfile(res.profile);
                const stored = localStorage.getItem("profile_picture");
                setProfileImage(stored || res.profile.profile_picture || "https://via.placeholder.com/120");
            } else {
                navigate("/employerForm");
            }

            setLoading(false);
        };

        const fetchSkillsAndProposals = async () => {
            const employerId = localStorage.getItem("user_id");

            // Habilidades disponibles
            const skillsRes = await actions.getSkills();
            if (skillsRes.success) {
                const options = skillsRes.skills.map(skill => ({
                    value: skill.id,
                    label: skill.name
                }));
                setAvailableSkills(options);
            }

            // Propuestas del empleador
            const res = await actions.getEmployerProposals(employerId);
            if (res.success) {
                setProposals(res.proposals);
            } else {
                console.error("Error cargando propuestas:", res.error);
            }
        };


        fetchProfile();
        fetchSkillsAndProposals();
    }, [actions]);

    const handleEditProfile = () => navigate("/employerForm");

    const handleCreateProject = async (e) => {
        e.preventDefault();
    
        const res = await actions.createProject({
            title,
            description,
            budget: parseFloat(budget),
            skills: selectedSkills.map(skill => skill.value)
        });
    
        if (res.success) {
            alert("Oferta creada exitosamente.");
            setShowForm(false);
            setTitle("");
            setDescription("");
            setBudget("");
            setSelectedSkills([]);
        } else {
            alert("Error al crear la oferta: " + res.error);
        }
    };

    const handleHire = (proposalId) => navigate(`/payment/${proposalId}`);

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
            } else {
                alert("Error al actualizar foto");
            }
        };
        reader.readAsDataURL(file);
    };

    

    if (loading) return <div className="text-center mt-5">Cargando perfil...</div>;
    if (!profile) return <div className="text-center mt-5">Perfil no encontrado.</div>;

    const fullName = `${profile.user?.first_name || ""} ${profile.user?.last_name || ""}`;

    return (
        <div className="container mt-5" style={{ minHeight: "100vh" }}>
            <div className="text-center mb-5">
                <h2 className="fw-bold">Perfil del Empleador</h2>
                <div className="card mb-4 p-4">
                    <div className="d-flex align-items-center flex-column flex-md-row">
                        {/* Imagen con botón de cámara */}
                        <div className="position-relative me-md-4 mb-3 mb-md-0">
                            <img
                                src={profileImage}
                                alt="Foto de perfil"
                                className="rounded-circle"
                                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                            />
                            <label
                                htmlFor="upload-photo"
                                className="position-absolute bottom-0 end-0 bg-light rounded-circle p-1 border"
                                style={{ cursor: "pointer", width: "30px", height: "30px", display: "flex", justifyContent: "center", alignItems: "center" }}
                                title="Cambiar foto"
                            >
                                <i className="fas fa-camera"></i>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                id="upload-photo"
                                style={{ display: "none" }}
                                onChange={handlePictureChange}
                            />
                        </div>

                        {/* Info personal */}
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

            {/* Botones de acción */}
            <div className="d-flex justify-content-center gap-3 mb-4">
                <button className="btn btn-dark" onClick={() => setShowForm((prev) => !prev)}>
                    {showForm ? "Cancelar" : "Crear nueva oferta"}
                </button>
                <button className="btn btn-outline-primary" onClick={() => setShowProposals((prev) => !prev)}>
                    {showProposals ? "Ocultar solicitudes" : "Ver solicitudes recibidas"}
                </button>
            </div>

            {/* Formulario de oferta */}
            {showForm && (
                <div className="card shadow mb-4">
                    <div className="card-body">
                        <h5 className="mb-4">Nueva Oferta de Trabajo</h5>
                        <form onSubmit={handleCreateProject}>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Título del proyecto"
                                    value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <textarea className="form-control" placeholder="Descripción"
                                    value={description} onChange={(e) => setDescription(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <input type="number" className="form-control" placeholder="Presupuesto (USD)"
                                    value={budget} onChange={(e) => setBudget(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Habilidades requeridas</label>
                                <Select
                                    isMulti
                                    options={availableSkills}
                                    value={selectedSkills}
                                    onChange={setSelectedSkills}
                                    placeholder="Selecciona las habilidades necesarias"
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-100">Publicar proyecto</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Propuestas */}
            {showProposals && (
                <div className="card shadow mb-5">
                    <div className="card-body">
                        <h5 className="mb-4 text-center">Solicitudes Recibidas</h5>
                        {proposals.length > 0 ? (
                            proposals.map((proposal) => (
                                <div key={proposal.id} className="border rounded p-3 mb-3">
                                    <h6>Proyecto: {proposal.project?.title || "Sin título"}</h6>
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
