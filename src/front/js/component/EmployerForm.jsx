import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const EmployerForm = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState(null);
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const countryOptions = [
    { value: "Argentina", label: "Argentina" },
    { value: "Bolivia", label: "Bolivia" },
    { value: "Brasil", label: "Brasil" },
    { value: "Chile", label: "Chile" },
    { value: "Colombia", label: "Colombia" },
    { value: "Ecuador", label: "Ecuador" },
    { value: "Paraguay", label: "Paraguay" },
    { value: "Peru", label: "Perú" },
    { value: "Uruguay", label: "Uruguay" },
    { value: "Venezuela", label: "Venezuela" },
  ];

  useEffect(() => {
    const loadEmployerProfile = async () => {
      const userId = store.userId;
      if (!userId) return setLoading(false);

      const res = await actions.getEmployerProfile(userId);
      if (res.success && res.profile) {
        const profile = res.profile;
        setBio(profile.bio || "");
        setProfileImage(profile.profile_picture || "");
        setIndustry(profile.industry || "");
        setWebsite(profile.website || "");
        setPhone(profile.phone || "");
        setLocation(profile.location ? { value: profile.location, label: profile.location } : null);
      }
      setLoading(false);
    };

    loadEmployerProfile();
  }, [store.userId, actions]);

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageUrl = reader.result;
      const userId = localStorage.getItem("user_id");
      const res = await actions.uploadEmployerPicture(userId, imageUrl);
      if (res.success) {
        setProfileImage(imageUrl);
        alert("Foto actualizada");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bio.trim()) return alert("Por favor, ingresa una descripción válida.");

    setSaving(true);
    const userId = store.userId;
    if (!userId) {
      setSaving(false);
      return alert("No hay usuario activo");
    }

    const payload = {
      bio,
      profile_image: profileImage,
      industry,
      location: location?.value || "",
      website,
      phone
    };

    const resProfile = await actions.createOrUpdateEmployerProfile(userId, payload);
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
      <h2 className="mb-4 text-center fw-bold">Editar Perfil de Empresa</h2>
      <div className="card shadow-lg border-0 rounded-4 mb-4" style={{ maxWidth: "50rem", margin: "auto" }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>

            {/* Imagen de perfil */}
            <div className="mb-4 text-center">
              <div className="position-relative d-inline-block">
                <img
                  src={profileImage}
                  alt="Foto de perfil"
                  className="rounded-circle"
                  style={{ width: 120, height: 120, objectFit: "cover" }}
                />
                <label
                  htmlFor="upload-photo"
                  className="position-absolute bottom-0 end-0 bg-light rounded-circle p-1 border"
                  style={{
                    cursor: "pointer",
                    width: 30,
                    height: 30,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  title="Cambiar foto"
                >
                  <i className="fas fa-camera"></i>
                </label>
                <input
                  id="upload-photo"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePictureChange}
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
                style={{ borderRadius: "10px" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Categoría / Industria</label>
              <input
                type="text"
                className="form-control"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Ej. Tecnología, Finanzas, Marketing..."
                style={{ borderRadius: "10px" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">País</label>
              <Select
                options={countryOptions}
                value={location}
                onChange={setLocation}
                placeholder="Selecciona un país"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Sitio web</label>
              <input
                type="url"
                className="form-control"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://miempresa.com"
                style={{ borderRadius: "10px" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Teléfono de contacto</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52 1 234 567 890"
                style={{ borderRadius: "10px" }}
              />
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-info w-100 py-2 rounded-pill shadow-sm" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar Perfil"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerForm;
