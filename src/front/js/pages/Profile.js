import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import undefinedImg from "./../../../front/img/User_Undefined.jpg";
import styles from "./../../styles/index.css"

export const Profile = () => {
    const { id } = useParams();
    const { actions } = useContext(Context);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm border-light freelancer-profile">
                        <div className="card-body">
                            <div className="text-center">
                                <img
                                    src={profile.profile_picture || undefinedImg}
                                    alt="Foto de perfil"
                                    className="rounded-circle mb-4"
                                    width="250"
                                    height="250"
                                    style={{ objectFit: "cover" }}
                                />
                                <h2 className="card-title mb-3">
                                    {profile.user.first_name} {profile.user.last_name}
                                </h2>
                                <p className="text-muted mb-3">
                                    <strong>Desarrollador web</strong>
                                </p>
                                <p className="card-text text-justify">
                                    {profile.bio || "Sin biografía disponible."}
                                </p>
                            </div>

                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <strong>Ubicación:</strong> Madrid, España
                                </li>
                                <li className="list-group-item">
                                    <strong>Habilidades:</strong>{" "}
                                    {profile.skills.length > 0 ? (
                                        profile.skills.map((skill, idx) => (
                                            <span key={idx} className="badge bg-secondary me-1">
                                                {skill.name}
                                            </span>
                                        ))
                                    ) : (
                                        "Sin habilidades"
                                    )}
                                </li>
                                <li className="list-group-item">
                                    <strong>Rating:</strong>{" "}
                                    {profile.rating ? `⭐ ${profile.rating}` : "No rating"}
                                </li>
                            </ul>

                            <div className="card-body text-center">
                                <button className="btn btn-primary me-2">Mensaje</button>
                                <button className="btn btn-success">Conectar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
