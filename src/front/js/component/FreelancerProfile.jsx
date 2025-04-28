import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

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

      if (response.success) {
        console.log("Perfil recibido:", response.profile);
        setProfile(response.profile);
      } else {
        console.error("Error al cargar el perfil:", response.error);
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

      <div className="card">
        <div className="card-body">
          <div className="text-center mb-3">
            <img
              src={profile.profile_picture || "https://i.pravatar.cc/150?img=5"}
              alt="Foto de perfil"
              width="120"
              className="rounded-circle"
            />
          </div>

          <h4 className="text-center">{fullName}</h4>
          <p><strong>Biografía:</strong> {profile.bio || "Sin biografía aún."}</p>
          <p><strong>Tarifa por hora:</strong> ${profile.hourly_rate || "No definida"}</p>
          <p><strong>Calificación:</strong> {profile.rating || "Sin calificación"}</p>

          <div className="mt-4">
            <strong>Habilidades:</strong>
            <ul>
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((fs, index) => (
                  <li key={fs.skill?.id || index}>
                    {fs.skill?.name || "Skill desconocida"}
                  </li>
                ))
              ) : (
                <li>No hay habilidades registradas.</li>
              )}
            </ul>
          </div>

          {/* BOTÓN PARA EDITAR PERFIL */}
          <div className="text-center mt-4">
            <button className="btn btn-dark px-4 py-2" onClick={handleEditProfile}>
              Editar Perfil
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
