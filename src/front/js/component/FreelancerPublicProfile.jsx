import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";
import undefinedImg from "./../../../front/img/User_Undefined.jpg";

const FreelancerPublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { actions, store } = useContext(Context);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await actions.getFreelancerProfile(userId);
      if (response.success && response.profile) {
        setProfile(response.profile);
      } else {
        navigate("/");
      }
      setLoading(false);
    };

    if (userId) fetchProfile();
  }, [userId]);

  if (loading) return <div className="text-center mt-5">Cargando perfil...</div>;
  if (!profile) return <div className="text-center mt-5">Perfil no encontrado</div>;

  const fullName =
    profile.user?.first_name && profile.user?.last_name
      ? `${profile.user.first_name} ${profile.user.last_name}`
      : "Nombre no disponible";



  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Perfil público del Freelancer</h2>

      <div className="card shadow-sm p-4 mb-4 mx-auto" style={{ maxWidth: "600px" }}>
        <div className="text-center">
          <img
            src={profile.profile_picture || undefinedImg}
            alt="Foto de perfil"
            className="rounded-circle mb-3"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
          <h3>{fullName}</h3>
          <p className="text-muted">{profile.bio || "Sin biografía"}</p>
        </div>

        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Ubicación:</strong> {profile.location || "No definida"}
          </li>
          <li className="list-group-item">
            <strong>Habilidades:</strong>{" "}
            {profile.skills?.length > 0
              ? profile.skills.map((skill) => (
                  <span key={skill.id} className="badge bg-secondary me-1">
                    {skill.name}
                  </span>
                ))
              : "No hay habilidades"}
          </li>
          <li className="list-group-item">
            <strong>Rating:</strong> ⭐ {profile.rating || "Sin calificación"}
          </li>
        </ul>

        <div className="text-center mt-3">
          <button className="btn btn-primary me-2">Mensaje</button>
          <button className="btn btn-success">Conectar</button>
        </div>
      </div>

      {/* ✅ Botones de navegación */}
      <div className="text-center mt-4">
       
        <button className="btn btn-outline-primary me-2" onClick={() => navigate("/")}>
          Volver al Home
        </button>
        {store.searchQuery && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/search?query=${encodeURIComponent(store.searchQuery)}`)}
          >
            Volver a resultados
          </button>
        )}
      </div>
    </div>
  );
};

export default FreelancerPublicProfile;

