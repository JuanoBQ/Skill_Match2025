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
      <h2 className="mb-4 text-center">Mi perfil</h2>

      <div className="card shadow-lg border-0 rounded-4 mb-4" style={{ maxWidth: "100rem", margin: "auto" }}>
        <div className="row g-0">

          <div className="d-flex justify-content-between align-items-center mt-4">

            <div className="d-flex align-items-center">
              <img
                src={profile.profile_picture || undefined}
                alt="Foto de perfil"
                className="ms-5 rounded-circle border border-3 border-primary shadow-lg"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div className="d-flex flex-column ms-3">
                <h4 className="mb-0" style={{ fontSize: "2rem" }}>
                  {fullName}
                </h4>
                <h4 className="text-dark mt-0 mb-1" style={{ fontSize: "1.1rem" }}>
                {profile.career}
                </h4>
                <h4 className="text-dark mt-0" style={{ fontSize: "1rem" }}>
                {profile.location}
                </h4>
              </div>
            </div>


            <div className="me-5">
              <button
                className="btn btn-info px-4 py-2 rounded-pill shadow-sm"
                onClick={handleEditProfile}
              >
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
              <strong className="text-dark">Habilidades:</strong><br></br>
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


            <p className="mb-2 text-dark">
              <strong>Educacion:</strong><br></br> {profile.education}
            </p>

          </div>


          <div className="d-flex flex-column col-6 ms-5 mb-5">
            <p className="text-dark mb-2">
              <strong>Biografía:</strong> {profile.bio || "Sin biografía aún."}
            </p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default FreelancerProfile;
