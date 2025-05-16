import React, { useState, useContext, useEffect } from "react";
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
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

        actions.getContacts();
        loadProfile();
    }, []);

    const goToProfile = (id) => {
        navigate(`/Profile/${id}`);
    };

    const handleDeleteContact = async (contactId) => {
        try {
            const result = await actions.deleteContact(contactId);
            if (result.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Contacto eliminado',
                    text: 'Se ha eliminado correctamente de tu lista.',
                    confirmButtonText: 'Ok'
                });
                // Refrescar lista de contactos
                await actions.getContacts();
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error al eliminar',
                    text: result.error || 'Ocurrió un error desconocido.',
                    confirmButtonText: 'Ok'
                });
            }
        } catch (error) {
            console.error("Error al eliminar el contacto:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'No se pudo eliminar el contacto. Intenta de nuevo más tarde.',
                confirmButtonText: 'Ok'
            });
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div
            className="accordion shadow-sm accordion-flush my-4"
            id="accordionFlushExample"
            style={{ maxWidth: "22rem" }}
        >
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                    >
                        <span className="fw-bold">Contactos</span>
                    </button>
                </h2>
                <div
                    id="flush-collapseOne"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample"
                >
                    <div className="accordion-body d-flex flex-column justify-content-center align-items-center">
                        {store.contacts.length > 0 ? (
                            store.contacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className="card mb-2 shadow-sm"
                                    style={{ borderRadius: '12px', width: '100%' }}
                                >
                                    <div className="row g-0">
                                        <div className="col-3 d-flex justify-content-center align-items-center p-2">
                                            <img
                                                src={contact.profile_picture || undefinedImg}
                                                alt="Foto de perfil"
                                                className="rounded-circle img-fluid border border-3 border-primary"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                    transition: 'box-shadow 0.3s ease-in-out'
                                                }}
                                            />
                                        </div>
                                        <div className="col-8 d-flex flex-row">
                                            <div className="card-body p-2">
                                                <h6 className="text-dark fs-7 fw-bold mb-1">
                                                    {contact.first_name} {contact.last_name}
                                                </h6>
                                                <p className="text-muted fs-8 mb-1">
                                                    {contact.career}
                                                </p>
                                                <button
                                                    className="btn btn-outline-primary btn-sm mt-1"
                                                    style={{ borderRadius: '12px' }}
                                                    onClick={() => goToProfile(contact.id)}
                                                >
                                                    Ver Perfil
                                                </button>
                                            </div>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <button
                                                    className="btn btn-danger btn-sm mt-1 ms-2"
                                                    style={{ borderRadius: '50%', fontSize: '1rem' }}
                                                    onClick={() => handleDeleteContact(contact.id)}
                                                >
                                                    <span className="text-white">X</span>
                                                </button>
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
        </div>
    );
};
