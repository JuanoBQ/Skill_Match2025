import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import undefined from "./../../../front/img/User_Undefined.jpg"

const FreelancerProfile = () => {
  const navigate = useNavigate();
  const { actions } = useContext(Context);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        console.error("No hay user_id en localStorage.");
        setLoading(false);
        return;
      }

      const response = await actions.getFreelancerProfile(userId);

      if (response.success && response.profile && response.profile.bio !== null) {
        console.log("Perfil recibido:", response.profile);
        setProfile(response.profile);
      } else {
        console.warn("Perfil incompleto o no encontrado, redirigiendo...");
        navigate("/profileForm");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [actions, navigate]);

  const handleEditProfile = () => {
    navigate('/profileForm');
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando perfil...</div>;
  }

  if (!profile) {
    return <div className="text-center mt-5">No se encontró el perfil.</div>;
  }

  const fullName = profile.user?.first_name && profile.user?.last_name
    ? `${profile.user.first_name} ${profile.user.last_name}`
    : "Nombre no disponible";

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Perfil del Freelancer</h2>

      <div className="card shadow-lg border-0 rounded-4 mb-4" style={{ maxWidth: "40rem", margin: "auto" }}>
        <div className="row g-0">

          <div className="col-md-4 d-flex justify-content-center align-items-center">
            <img
              src={profile.profile_picture || undefined}
              alt="Foto de perfil"
              className="rounded-circle border border-3 border-primary shadow-lg"
              style={{
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>


          <div className="col-md-8 p-4">
            <h4 className="text-center text-dark mb-3" style={{ fontSize: "1.5rem" }}>
              {fullName}
            </h4>

            <p className="text-muted mb-2">
              <strong>Biografía:</strong> {profile.bio || "Sin biografía aún."}
            </p>

            <p className="text-muted mb-2">
              <strong>Tarifa por hora:</strong> ${profile.hourly_rate || "No definida"}
            </p>

            <p className="text-muted mb-4">
              <strong>Calificación:</strong> ⭐ {profile.rating || "Sin calificación"}
            </p>


            <div className="mt-4">
              <strong className="text-dark">Habilidades:</strong>
              <div className="mt-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span key={skill.id || index} className="badge bg-secondary me-1">
                      {skill.name || "Habilidad desconocida"}
                    </span>
                  ))
                ) : (
                  <span className="badge bg-secondary">No hay habilidades registradas.</span>
                )}
              </div>
            </div>


            <div className="text-center mt-4">
              <button className="btn btn-info px-4 py-2 rounded-pill shadow-sm" onClick={handleEditProfile}>
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default FreelancerProfile;
