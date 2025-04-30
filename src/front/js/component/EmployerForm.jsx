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
            <h2 className="mb-4 text-center">Editar Perfil de Empleador</h2>
            <form onSubmit={handleSubmit} className="card shadow-sm p-4">
                <div className="mb-3">
                    <label className="form-label">Descripción / Sobre nosotros</label>
                    <textarea
                        className="form-control"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Describe tu empresa o tu rol como empleador"
                        rows={4}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Foto de perfil (URL)</label>
                    <input
                        type="url"
                        className="form-control"
                        value={profilePicture}
                        onChange={(e) => setProfilePicture(e.target.value)}
                        placeholder="https://..."
                        pattern="https?://.+"
                    />
                </div>

                <button type="submit" className="btn btn-dark w-100" disabled={saving}>
                    {saving ? "Guardando..." : "Guardar Perfil"}
                </button>
            </form>
        </div>
    );
};

export default EmployerForm;