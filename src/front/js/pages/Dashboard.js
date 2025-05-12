import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Tabs } from "../component/tabs.jsx";
import { UsefullCard } from "../component/usefullCard.jsx";
import { DashAccordion } from "../component/dashAccordion.jsx";
import DashboardFilter from "../component/DashboardFilter.jsx"
import undefined from "./../../../front/img/User_Undefined.jpg"
import styles from './../../styles/index.css';
import banner from "../../../../public/Banner.png"

export const Dashboard = () => {
    const { store, actions } = useContext(Context);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        if (!store.isAuthenticated) {
            setLoading(false);
            return;
        }

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

    }, [actions, store.isAuthenticated]);


    const fullName = profile?.user
        ? `${profile.user.first_name} ${profile.user.last_name}`
        : "Nombre no disponible";

    return (
        <div className="container-fluid animate__animated animate__fadeIn">
            <div className="row">

                <div className="col-lg-8 ms-5 mb-4">
                    <div className="d-flex">
                        <div className="container-fluid mb-4 mx-3 mt-5">
                            <div style={{
                                width: "100%",
                                height: "23rem",
                                minHeight: "18rem",
                                borderRadius: "12px",
                                overflow: "hidden",
                                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <img
                                    src={banner}
                                    alt="Banner"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                    <Tabs />
                </div>


                <aside className="col-lg-3 mt-5 ms-2">
                    {store.isAuthenticated && (
                        <div className="card shadow-md rounded-3 mb-4" style={{ maxWidth: "22rem" }}>
                            <div className="card-body d-flex pb-3 align-items-center">
                                <img
                                    src={profile?.profile_picture || "/User_Undefined.jpg"}
                                    alt="Foto de perfil"
                                    className="rounded-circle"
                                    style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                />
                                <div className="ms-3">
                                    <h4 className="mb-0 fw-bold">{loading ? "Cargando..." : fullName}</h4>
                                </div>
                            </div>
                            <div className="card-body ms-3">
                                <h5 className="text-dark">Contactos: {profile && profile.contacts.length > 0 ? profile.contacts : "0"} </h5>
                            </div>
                        </div>
                    )}


                    {store.isAuthenticated && (
                        <>
                            <DashAccordion />
                        </>
                    )}
                    <DashboardFilter />
                    <UsefullCard />
                </aside>
            </div>
        </div>

    );
};
