import React from "react";
import { useState, useContext, useEffect } from "react";
import { Context } from '../store/appContext';
import undefinedImg from "./../../../front/img/User_Undefined.jpg";

export const DashAccordion = () => {

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

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="accordion shadow-sm accordion-flush my-4" id="accordionFlushExample" style={{ maxWidth: "22rem" }}>
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                        <span className="fw-bold">Contactos</span>
                    </button>
                </h2>
                <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                        
                        {profile && profile.contacts && profile.contacts.length > 0 ? (
                            profile.contacts.map((contact) => (
                                <div className="card mb-4 freelancer-card shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }} key={contact.user.id}>
                                    <div className="row no-gutters">
                                        <div className="col-md-2 d-flex justify-content-center align-items-center p-3">
                                            <img
                                                src={contact.profile_picture || undefinedImg}
                                                alt="Foto de perfil"
                                                className="rounded-circle img-fluid border border-3 border-primary"
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-10">
                                            <div className="card-body p-4">
                                                <h4 className="text-dark fs-5 fw-bold mb-2">{contact.user.first_name} {contact.user.last_name}</h4>
                                                <h5 className="text-muted mb-3">{contact.career}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay contactos.</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                        <span className="fw-bold">Mensajes</span>
                    </button>
                </h2>
                <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">No hay mensajes!</div>
                </div>
            </div>
        </div>
    );
};