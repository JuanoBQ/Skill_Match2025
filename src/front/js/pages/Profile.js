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

            <div >
                <div className="card shadow-sm border-light freelancer-profile" >
                    <div className="card-body">


                        <div className="d-flex align-items-center mb-4">
                            <img
                                src={profile.profile_picture || undefined}
                                alt="Foto de perfil"
                                className="ms-1 rounded-circle border border-3 border-primary shadow-lg"
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                            />

                            <div className="d-flex flex-column ms-3">
                                <h4 className="mb-0" style={{ fontSize: "2rem" }}>
                                    {profile.user.first_name} {profile.user.last_name}
                                </h4>
                                <h4 className="text-dark mt-0 mb-1" style={{ fontSize: "1.1rem" }}>
                                    {profile.career}
                                </h4>

                            </div>
                        </div>



                        <p className="card-text text-justify">
                            {profile.bio || "Sin biografía disponible."}
                        </p>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <strong>Ubicación:</strong> {profile.location}
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
    );
};
