import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import undefinedImg from "./../../../front/img/User_Undefined.jpg";

const FreelancerProfile = () => {
  const navigate = useNavigate();
  const { actions } = useContext(Context);

  // Estados originales
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados nuevos para proposals y modal
  const [completedProposals, setCompletedProposals] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProposal, setCurrentProposal] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [completedProjects, setCompletedProjects] = useState([]);
  const [sentProposals, setSentProposals] = useState([]);
  const [stats, setStats] = useState({
    offers: 0,
    proposals: 0,
    completed: 0,
    rating: 0,
  });

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("No hay user_id en localStorage.");
      setLoading(false);
      return;
    }

    const loadAll = async () => {

      // 1) Traer perfil
      const profileRes = await actions.getFreelancerProfile(userId);
      if (profileRes.success) {
        setProfile(profileRes.profile);
        const stored = localStorage.getItem("profile_picture");
        setProfileImage(
          stored ||
          profileRes.profile.profile_picture ||
          undefinedImg
        );
      } else {
        navigate("/freelancerForm");
        return;
      }

      setProfile(profileRes.profile);

      // 2) Traer propuestas completadas
      const respProps = await actions.getFreelancerCompletedProposals(userId);
      if (respProps.success) {
        setCompletedProposals(respProps.proposals);
      }

      const respSent = await actions.getFreelancerSentProposals(userId);
      console.log("🚀 solicitudes enviadas del API:", respSent);
      if (respSent.success) {
        setSentProposals(respSent.proposals);
      }

      const completedRes = await actions.getCompletedProjects();
      if (completedRes.success) {
        setCompletedProjects(completedRes.projects);
      }

      const statsRes = await actions.getEmployerStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      setLoading(false);
    };

    loadAll();
  }, [actions, navigate]);

  // Abrir modal para calificar
  const handleOpenReview = (proposal) => {
    setCurrentProposal(proposal);
    setRating(0);
    setComment("");
    setModalOpen(true);
  };

  // Enviar review
  const submitReview = async () => {
    const payload = {
      proposal_id: currentProposal.id,
      reviewee_id: currentProposal.project.employer_id,
      rating,
      comment,
    };
    const resp = await actions.createReview(payload);
    if (resp.success) {
      // marcar como calificado
      setCompletedProposals((prev) =>
        prev.map((p) =>
          p.id === currentProposal.id ? { ...p, reviewed: true } : p
        )
      );
      // actualizar promedio en UI
      setProfile((p) => ({ ...p, rating: resp.data.new_average }));
      setModalOpen(false);
    } else {
      alert(resp.msg);
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando perfil...</div>;
  if (!profile) return <div className="text-center mt-5">No se encontró el perfil.</div>;

  const fullName = profile.user?.first_name && profile.user?.last_name
    ? `${profile.user.first_name} ${profile.user.last_name}`
    : "Nombre no disponible";

  return (
    <div className="container mt-5 animate__animated animate__fadeIn" style={{ minHeight: "100vh" }}>
      <div className="row mb-5">
        <div className="col">

          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="row g-0">

              <div className="col-md-4 bg-light text-md-start text-center py-4 px-3">
                <img
                  src={profileImage}
                  alt="Foto de perfil"
                  className="rounded-circle shadow-sm border mb-3"
                  style={{ width: 120, height: 120, objectFit: "cover" }}
                />

                <h4 className="fw-bold mb-1">{fullName}</h4>
                <p className="text-secondary mb-3">{profile.user?.email}</p>
                <h4 className="text-dark mt-0 mb-1" style={{ fontSize: "1.1rem" }}>
                  {profile.career}
                </h4>
                <h4 className="text-dark mt-0 mb-3" style={{ fontSize: "1rem" }}>
                  {profile.location}
                </h4>

                <button
                  className="btn btn-outline-primary rounded-pill px-4 mb-4"
                  onClick={() => navigate("/freelancerForm")}
                >
                  Editar Perfil
                </button>

                <div className="ps-3">
                  <p className="mb-2 text-dark">
                    <strong>Idiomas:</strong><br /> {profile.language}
                  </p>
                  <p className="mb-2 text-dark">
                    <strong>Tarifa por hora:</strong><br /> ${profile.hourly_rate || "No definida"}
                  </p>
                  <p className="mb-2 text-dark">
                    <strong>Calificación:</strong><br /> ⭐ {profile.rating || "Sin calificación"}
                  </p>
                  <div className="mb-2">
                    <strong>Habilidades:</strong><br />
                    {profile.skills.length
                      ? profile.skills.map((s) => (
                        <span key={s.id} className="badge bg-secondary me-1">
                          {s.name}
                        </span>
                      ))
                      : <span className="badge bg-secondary">No hay habilidades</span>
                    }
                  </div>
                  <p className="mb-2 text-dark">
                    <strong>Educación:</strong><br />{profile.education}
                  </p>
                </div>
              </div>

              <div className="col-md-8">
                <div className="p-4" style={{ whiteSpace: "pre-line" }}>
                  <h5 className="fw-bold">Bio</h5>
                  <p className="text-justify">
                    {profile.bio || <span className="text-muted">Sin descripción.</span>}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4">
            <details>
              <summary className="fw-bold">Proyectos completados ({completedProposals.length})</summary>
              <ul className="list-group mt-2">
                {completedProposals.map((p) => (
                  <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{p.project.title}</strong><br />
                      Empleador: {p.project.employer_name}
                    </div>
                    {p.reviewed
                      ? <span className="badge bg-success">Calificado</span>
                      : <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleOpenReview(p)}
                      >
                        Calificar
                      </button>
                    }
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {modalOpen && (
            <div className="modal-backdrop d-flex justify-content-center align-items-center">
              <div className="modal-content p-4" style={{ maxWidth: 400, width: "100%" }}>
                <h5 className="mb-3">Calificar a {profile.user.first_name}</h5>
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
                  onChange={e => setComment(e.target.value)}
                />
                <div className="d-flex justify-content-end">
                  <button className="btn btn-secondary me-2" onClick={() => setModalOpen(false)}>Cancelar</button>
                  <button className="btn btn-primary" onClick={submitReview} disabled={rating === 0}>Enviar</button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-auto d-flex flex-column gap-3 align-items-end">
          {[
            { label: "Solicitudes Enviadas", value: sentProposals.length },
            { label: "Trabajos completados", value: completedProjects.length },
            { label: "Valoración promedio", value: `${stats.rating.toFixed(1)}★` },
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
    </div>
  );
};

export default FreelancerProfile;