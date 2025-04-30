import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const EmployerForm = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadEmployerProfile = async () => {
            const userId = store.userId;
            if (!userId) return;

            const res = await actions.getEmployerProfile(userId);
            if (res.success && res.profile) {
                const profile = res.profile;
                setBio(profile.bio || "");
                setProfilePicture(profile.profile_picture || "");
            }
            setLoading(false);
        };

        loadEmployerProfile();
    }, [store.userId, actions]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!bio.trim()) {
            return alert("Por favor, ingresa una descripción válida.");
        }

        setSaving(true);
        const userId = store.userId;
        if (!userId) return alert("No hay usuario activo");

        const resProfile = await actions.createOrUpdateEmployerProfile(userId, {
            bio,
            profile_picture: profilePicture
        });

        setSaving(false);

        if (!resProfile.success) {
            alert("Error al actualizar perfil");
        } else {
            navigate("/employerProfile");
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Cargando datos del perfil...</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center fw-bold">Editar Perfil</h2>
            <form onSubmit={handleSubmit} className="card shadow-sm p-4 animate__animated animate__fadeIn">

                <div className="mb-4 text-center">
                    <div className="position-relative d-inline-block">
                        <img
                            src={profilePicture || "/default-avatar.png"}
                            alt="Foto de perfil"
                            className="rounded-circle border"
                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                        />
                        <label
                            htmlFor="uploadProfile"
                            className="position-absolute bg-light border rounded-circle"
                            style={{
                                bottom: 0,
                                right: 0,
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer"
                            }}
                        >
                            <i className="fas fa-camera"></i>
                        </label>
                        <input
                            type="file"
                            id="uploadProfile"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const result = await actions.uploadEmployerPicture(store.userId, file);
                                    if (result.success) {
                                        setProfilePicture(`${process.env.PUBLIC_URL}${result.pictureUrl}`);
                                        localStorage.setItem("profile_picture", result.pictureUrl);
                                    } else {
                                        alert("Error al subir la imagen");
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Describe tu empresa o tu rol como empleador"
                        rows={4}
                        required
                    />
                    <div className="invalid-feedback">
                        Este campo es obligatorio.
                    </div>
                    <small className="form-text text-muted">
                        Describe la misión de tu empresa, tus valores o el tipo de talento que buscas.
                    </small>
                </div>

                <button type="submit" className="btn btn-dark w-100" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> : "Guardar Perfil"}
                </button>
            </form>
        </div>
    );
};

export default EmployerForm;