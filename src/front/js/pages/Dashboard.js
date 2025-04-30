import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Tabs } from "../component/tabs.jsx";
import { UsefullCard } from "../component/usefullCard.jsx";
import { DashAccordion } from "../component/dashAccordion.jsx";

export const Dashboard = () => {
    const { actions } = useContext(Context);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const userId = localStorage.getItem("user_id");
            if (!userId) return;

            const response = await actions.getFreelancerProfile(userId);
            if (response.success) {
                setProfile(response.profile);
            }
            setLoading(false);
        };

        loadProfile();
    }, [actions]);

    const fullName = profile?.user
        ? `${profile.user.first_name} ${profile.user.last_name}`
        : "Nombre no disponible";

    return (
        <div className="container">
            <div className="row">
                <div className="col-8">
                    <div className="d-flex">
                        <div className="container mb-5 background rounded-3 mx-5 mt-5">
                            <div className="ps-5 container-fluid py-5 text-start">
                                <h1 className="display-6">Listo para comenzar!</h1>
                                <p className="fs-5">Conecta con gente de todas partes del mundo!</p>
                            </div>
                        </div>
                    </div>
                    <Tabs />
                </div>

                <aside className="col-4 mt-5">
                    <div className="card mx-0 shadow-sm border border-0 background" style={{ maxWidth: "22rem" }}>
                        <div className="card-body d-flex pb-2 border-bottom align-items-center">
                            <img
                                src={profile?.profile_picture || "https://i.pravatar.cc/150?img=5"}
                                alt="Foto de perfil"
                                className="rounded-circle"
                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                            />
                            <h4 className="ms-3 mb-0">{loading ? "Cargando..." : fullName}</h4>
                        </div>
                        <div className="card-body ms-3">
                            <h5>Trabajos terminados: 6</h5>
                        </div>
                    </div>

                    <DashAccordion />
                    <UsefullCard />
                </aside>
            </div>
        </div>
    );
};
