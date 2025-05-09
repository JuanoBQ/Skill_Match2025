import React, { useContext, useEffect, useState } from "react";
import { useParams ,useNavigate} from "react-router-dom";
import { Context } from "../store/appContext";
import undefinedImg from "./../../../front/img/User_Undefined.jpg";
import styles from "./../../styles/index.css"; 


export const Profile = () => {
    const { id } = useParams();
    const { actions } = useContext(Context);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const loadProfile = async () => {
            const res = await actions.getFreelancerProfile(id);
            if (res.success) {
                setProfile(res.profile);
            }
            setIsLoading(false);
        };

        loadProfile();
    }, [id]);

  
    if (isLoading) {
        return <div className="text-center mt-5">Cargando perfil...</div>;
    }


    if (!profile) {
        return <div className="text-center mt-5">Perfil no encontrado</div>;
    }

    return (
        <div className="container mt-5">
    <div className="card shadow-sm border-light" style={{ borderRadius: "15px", overflow: "hidden" }}>
        <div className="card-body p-4">

            {/* Sección de Foto de Perfil y Datos del Usuario */}
            <div className="d-flex align-items-center mb-4">
                <img
                    src={profile.profile_picture || undefinedImg}
                    alt="Foto de perfil"
                    className="rounded-circle border border-3 border-primary shadow-lg"
                    style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                    }}
                />
                <div className="ms-3">
                    <h4 className="fw-bold" style={{ fontSize: "1.9rem" }}>
                        {profile.user.first_name} {profile.user.last_name}
                    </h4>
                    <h5 className="text-muted" style={{ fontSize: "1.1rem" }}>
                        {profile.career || "Carrera no especificada"}
                    </h5>
                </div>
            </div>

            {/* Biografía */}
            <p className="card-text text-muted mb-4" style={{ height: "100px", overflow: "hidden", textOverflow: "ellipsis" }}>
                {profile.bio || "Sin biografía disponible."}
            </p>

            {/* Información adicional (Idioma, Ubicación, Habilidades, Rating, Educación, Tarifa) */}
            <div className="mb-4">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                        <strong>Idioma:</strong>
                        <span>{profile.language || "Idioma no especificado"}</span>
                    </li>

                    <li className="list-group-item d-flex justify-content-between">
                        <strong>Ubicación:</strong>
                        <span>{profile.location || "Ubicación no especificada"}</span>
                    </li>

                    <li className="list-group-item d-flex justify-content-between">
                        <strong>Habilidades:</strong>
                        <span>
                            {profile.skills && profile.skills.length > 0 ? (
                                profile.skills.map((skill, idx) => (
                                    <span key={idx} className="badge bg-secondary me-2">{skill.name || "Habilidad desconocida"}</span>
                                ))
                            ) : (
                                "Sin habilidades registradas"
                            )}
                        </span>
                    </li>

                    <li className="list-group-item d-flex justify-content-between">
                        <strong>Rating:</strong>
                        <span>{profile.rating ? `⭐ ${profile.rating}` : "⭐ Sin calificación"}</span>
                    </li>

                    <li className="list-group-item d-flex justify-content-between">
                        <strong>Educación:</strong>
                        <span>{profile.education || "Educación no especificada"}</span>
                    </li>

                    <li className="list-group-item d-flex justify-content-between">
                        <strong>Tarifa por hora:</strong>
                        <span>{profile.hourly_rate ? `$${profile.hourly_rate} USD` : "No definida"}</span>
                    </li>
                </ul>
            </div>

            {/* Botones de Acción */}
            <div className="d-flex justify-content-center mb-4">
                <button className="btn btn-primary me-3" style={{ width: "150px" }}>Mensaje</button>
                <button className="btn btn-success" style={{ width: "150px" }}>Conectar</button>
            </div>

            {/* Botón Volver */}
            <div className="text-center">
                <button className="btn btn-secondary" style={{ width: "150px" }} onClick={() => navigate(-1)}>
                    Volver
                </button>
            </div>

        </div>
    </div>
</div>

    );
};
