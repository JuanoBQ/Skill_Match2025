import React from "react";
import { useState, useContext, useEffect } from "react";
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import undefinedImg from "./../../../front/img/User_Undefined.jpg";

export const DashAccordion = () => {

    const { store, actions } = useContext(Context);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.isAuthenticated) {
            setLoading(false);
            return;
        }

        const userId = localStorage.getItem("user_id");
        if (!userId) {
            setLoading(false);
            return;
        }

        const loadProfile = async () => {
            const response = await actions.getFreelancerProfile(userId);
            if (response.success) {
                setProfile(response.profile);
            }
            setLoading(false);
        };

        actions.getContacts()
        
        loadProfile();
    }, []);

    const goToProfile = (id) => {
        navigate(`/Profile/${id}`);
    };

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
                    <div className="accordion-body d-flex flex-column justify-content-center align-items-center">
                        {store.contacts.length > 0 ? (
                            store.contacts.map((contact) => (
                                <div key={contact.id} className="card mb-2 shadow-sm" style={{ borderRadius: '12px', width: '100%' }}
                                >

                                    <div className="row no-gutters">
                                        <div className="col-3 d-flex justify-content-center align-items-center p-2">
                                            <img
                                                src={contact.profile_picture || undefinedImg}
                                                alt="Foto de perfil"
                                                className="rounded-circle img-fluid border border-3 border-primary"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                    transition: 'box-shadow 0.3s ease-in-out'
                                                }}
                                            />
                                        </div>
                                        <div className="col-9">
                                            <div className="card-body p-2">
                                                <h6 className="text-dark fs-7 fw-bold mb-1">{contact.first_name} {contact.last_name}</h6>
                                                <p className="text-muted fs-8 mb-1">{contact.career}</p>
                                                <button className="btn btn-outline-primary btn-sm mt-1" style={{ borderRadius: '12px' }} onClick={() => goToProfile(contact.id)}>Ver Perfil</button>
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
