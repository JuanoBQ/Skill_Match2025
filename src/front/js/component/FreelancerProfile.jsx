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

  useEffect(() => {
    const fetchProfileAndProposals = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        console.error("No hay user_id en localStorage.");
        setLoading(false);
        return;
      }

      // 1) Traer perfil
      const respProfile = await actions.getFreelancerProfile(userId);
      if (!respProfile.success || !respProfile.profile?.bio) {
        navigate("/profileForm");
        return;
      }
      setProfile(respProfile.profile);

      // 2) Traer propuestas completadas
      const respProps = await actions.getFreelancerCompletedProposals(userId);
      if (respProps.success) {
        setCompletedProposals(respProps.proposals);
      }

      setLoading(false);
    };

    fetchProfileAndProposals();
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
    <div className="container mt-5">
      {/* ======== PERFIL ======== */}
      <h2 className="mb-4 text-center">Mi perfil</h2>
      <div className="card shadow-lg border-0 rounded-4 mb-4" style={{ maxWidth: "100rem", margin: "auto" }}>
        <div className="row g-0">
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="d-flex align-items-center">
              <img
                src={profile.profile_picture || undefinedImg}
                alt="Foto de perfil"
                className="ms-5 rounded-circle border border-3 border-primary shadow-lg"
                style={{ width: 150, height: 150, objectFit: "cover" }}
              />
              <div className="d-flex flex-column ms-3">
                <h4 className="mb-0" style={{ fontSize: "2rem" }}>{fullName}</h4>
                <h4 className="text-dark mt-0 mb-1" style={{ fontSize: "1.1rem" }}>{profile.career}</h4>
                <h4 className="text-dark mt-0" style={{ fontSize: "1rem" }}>{profile.location}</h4>
              </div>
            </div>
            <div className="me-5">
              <button className="btn btn-info px-4 py-2 rounded-pill shadow-sm" onClick={() => navigate('/profileForm')}>
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
        <div className="container d-flex flex-row ms-5 mt-5">

          <div className="basic col-3 mb-5">

            <p className="mb-2 text-dark">
              <strong>Idiomas:</strong><br></br> {profile.language}
            </p>



            <p className="mb-2 text-dark">
              <strong>Tarifa por hora:</strong><br></br> ${profile.hourly_rate || "No definida"}
            </p>

            <p className="mb-2 text-dark">
              <strong>Calificación:</strong><br></br> ⭐ {profile.rating || "Sin calificación"}
            </p>

            <div className="mb-2">
              <strong>Habilidades:</strong><br />
              {profile.skills.length ? profile.skills.map(s => (
                <span key={s.id} className="badge bg-secondary me-1">{s.name}</span>
              )) : <span className="badge bg-secondary">No hay habilidades</span>}
            </div>
            <p className="mb-2"><strong>Educación:</strong><br />{profile.education}</p>
          </div>
          <div className="col-6 ms-5 mb-5">
            <p><strong>Biografía:</strong> {profile.bio}</p>
          </div>
        </div>
      </div>

      {/* ======== PROYECTOS COMPLETADOS ======== */}
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

      {/* ======== MODAL DE CALIFICACIÓN ======== */}
      {modalOpen && (
        <div className="modal-backdrop d-flex justify-content-center align-items-center">
          <div className="modal-content p-4" style={{ maxWidth: 400, width: "100%" }}>
            <h5 className="mb-3">Calificar a {profile.user.first_name}</h5>
            <div className="mb-3">
              {[1,2,3,4,5].map(n => (
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
              <button className="btn btn-primary" onClick={submitReview} disabled={rating===0}>Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerProfile;