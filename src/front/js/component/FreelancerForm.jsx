import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
    FaJsSquare, FaPython, FaReact, FaVuejs, FaAngular,
    FaNodeJs, FaJava, FaCuttlefish, FaPhp, FaGem, FaDatabase
} from "react-icons/fa";

const FreelancerForm = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [bio, setBio] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkillOptions, setSelectedSkillOptions] = useState([]);
    const [education, setEducation] = useState("");
    const [language, setLanguage] = useState([]);
    const [career, setCareer] = useState(null);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const [skillsRes, profileRes] = await Promise.all([
                actions.getSkills(),
                actions.getFreelancerProfile(store.userId)
            ]);

            if (skillsRes.success) {
                const options = skillsRes.skills.map(skill => {
                    let icon = null;
                    switch (skill.name) {
                        case "JavaScript": icon = <FaJsSquare />; break;
                        case "Python": icon = <FaPython />; break;
                        case "React": icon = <FaReact />; break;
                        case "Vue.js": icon = <FaVuejs />; break;
                        case "Angular": icon = <FaAngular />; break;
                        case "Node.js": icon = <FaNodeJs />; break;
                        case "Java": icon = <FaJava />; break;
                        case "C#": icon = <FaCuttlefish />; break;
                        case "PHP": icon = <FaPhp />; break;
                        case "Ruby on Rails": icon = <FaGem />; break;
                        case "MongoDB": case "SQL": case "PostgreSQL": case "MySQL":
                            icon = <FaDatabase />; break;
                        case "Laravel": icon = <FaPhp />; break;
                        case "Express.js": icon = <FaNodeJs />; break;
                        case "Swift": icon = <FaReact />; break;
                    }
                    return {
                        value: skill.id,
                        label: (
                            <div className="d-flex align-items-center">
                                {icon && <span className="me-2">{icon}</span>}
                                {skill.name}
                            </div>
                        )
                    };
                });
                setAvailableSkills(options);
            }

            if (profileRes.success && profileRes.profile) {
                const profile = profileRes.profile;
                setBio(profile.bio || "");
                setHourlyRate(profile.hourly_rate || "");
                setProfileImage(profile.profile_picture || "");
                setEducation(profile.education || "");
                setLanguage(profile.language
                    ? profile.language.split(", ").map(lang => ({ value: lang, label: lang }))
                    : []);
                setCareer(profile.career ? { value: profile.career, label: profile.career } : null);
                setLocation(profile.location ? { value: profile.location, label: profile.location } : null);

                const matchedSkills = profile.skills
                    .map(fs => ({
                        value: fs.id ?? fs.skill?.id,
                        label: fs.name ?? fs.skill?.name
                    }))
                    .filter(skill => skill.value && skill.label);

                setSelectedSkillOptions(matchedSkills);
            }
        };

        if (store.userId) {
            loadData();
        }
    }, [store.userId]);

    const handlePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageUrl = reader.result;
            const userId = localStorage.getItem("user_id");
            const res = await actions.uploadFreelancerPicture(userId, imageUrl);
            if (res.success) {
                setProfileImage(imageUrl);
                alert("Foto actualizada");
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!bio || !hourlyRate || !profileImage) {
            return alert("Por favor completa todos los campos obligatorios.");
        }

        if (isNaN(hourlyRate) || hourlyRate <= 0) {
            return alert("La tarifa por hora debe ser un número válido mayor a cero.");
        }

        if (!career) {
            return alert("Por favor selecciona tu profesión.");
        }

        const userId = store.userId;
        if (!userId) return alert("No hay usuario activo");

        try {
            const resProfile = await actions.createOrUpdateProfile(userId, {
                bio,
                profile_picture: profileImage,
                hourly_rate: parseFloat(hourlyRate),
                career: career.value,
                education,
                language: language.map(lang => lang.value).join(", "),
                location: location?.value || ""
            });

            if (!resProfile.success) {
                console.error("Error en la actualización del perfil:", resProfile);
                return alert("Error al actualizar perfil");
            }

            await actions.clearFreelancerSkills(userId);

            const skillIds = selectedSkillOptions.map(option => option.value);
            if (skillIds.length > 0) {
                const resSkills = await actions.addFreelancerSkills(userId, skillIds);
                if (!resSkills.success) {
                    console.error("Error al asignar skills:", resSkills);
                    return alert("Error al asignar skills");
                }
            }

            navigate("/freelancerProfile");

        } catch (error) {
            console.error("Error inesperado al enviar la solicitud:", error);
            alert("Ocurrió un error inesperado.");
        }
    };

    return (
        <div className="container mt-5 animate__animated animate__fadeIn">
            <h2 className="mb-4 text-center text-dark">Editar Perfil</h2>
            <div className="card shadow-lg border-0 rounded-4 mb-4" style={{ maxWidth: "50rem", margin: "auto" }}>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="d-flex justify-content-center mb-3">
                            <div className="position-relative p-2">
                                <img
                                    src={profileImage}
                                    alt="Foto de perfil"
                                    className="rounded-circle"
                                    style={{ width: 120, height: 120, objectFit: "cover" }}
                                />
                                <label
                                    htmlFor="upload-photo"
                                    className="position-absolute bottom-0 end-0 bg-light rounded-circle p-1 border"
                                    style={{ cursor: "pointer", width: 30, height: 30 }}
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

                        <label htmlFor="bio" className="form-label">
                            Biografía
                        </label>
                        <textarea
                            id="bio"
                            className="form-control mb-4"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows="4"
                            style={{ borderRadius: "10px" }}
                        />

                        <div className="mb-3">
                            <label className="form-label">Tarifa por hora (USD)</label>
                            <input type="number" className="form-control" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} style={{ borderRadius: "10px" }} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Profesión</label>
                            <Select options={[
                                { value: 'Web Developer', label: 'Web Developer' },
                                { value: 'Graphic Designer', label: 'Graphic Designer' },
                                { value: 'Ui Ux designer', label: 'UI/UX Designer' },
                                { value: 'Mobile Developer', label: 'Mobile App Developer' },
                                { value: 'Data Scientist', label: 'Data Scientist' },
                                { value: 'Software Engineer', label: 'Software Engineer' },
                                { value: 'Backend Developer', label: 'Backend Developer' },
                                { value: 'Frontend Developer', label: 'Frontend Developer' },
                                { value: 'Fullstack Developer', label: 'Fullstack Developer' },
                                { value: 'Devops Engineer', label: 'DevOps Engineer' },
                                { value: 'Content Writer', label: 'Content Writer' },
                                { value: 'Copywriter', label: 'Copywriter' },
                                { value: 'Seo Specialist', label: 'SEO Specialist' },
                                { value: 'Digital Marketer', label: 'Digital Marketer' },
                                { value: 'video Editor', label: 'Video Editor' },
                                { value: 'Photographer', label: 'Photographer' },
                                { value: 'Illustrator', label: 'Illustrator' },
                                { value: 'Translator', label: 'Translator' },
                                { value: 'Virtual assistant', label: 'Virtual Assistant' },
                                { value: 'Project manager', label: 'Project Manager' }
                            ]}
                                value={career}
                                onChange={setCareer}
                                placeholder="Selecciona tu profesión"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Habilidades</label>
                            <Select
                                isMulti
                                options={availableSkills}
                                value={selectedSkillOptions}
                                onChange={setSelectedSkillOptions}
                                placeholder="Selecciona tus habilidades"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Idiomas</label>
                            <Select
                                isMulti
                                options={[
                                    { value: 'Ingles', label: 'Inglés' },
                                    { value: 'Español', label: 'Español' },
                                    { value: 'Portugués', label: 'Portugués' }
                                ]}
                                value={language}
                                onChange={setLanguage}
                                placeholder="Selecciona tu idioma"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">País</label>
                            <Select
                                options={[
                                    { value: 'Argentina', label: 'Argentina' },
                                    { value: 'Bolivia', label: 'Bolivia' },
                                    { value: 'Brasil', label: 'Brasil' },
                                    { value: 'Chile', label: 'Chile' },
                                    { value: 'Colombia', label: 'Colombia' },
                                    { value: 'Ecuador', label: 'Ecuador' },
                                    { value: 'Paraguay', label: 'Paraguay' },
                                    { value: 'Peru', label: 'Perú' },
                                    { value: 'Uruguay', label: 'Uruguay' },
                                    { value: 'Venezuela', label: 'Venezuela' }
                                ]}
                                value={location}
                                onChange={setLocation}
                                placeholder="Selecciona tu país"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Educación</label>
                            <input className="form-control" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="Universidad de Harvard" style={{ borderRadius: "10px" }} />
                        </div>

                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-info w-100 py-2 rounded-pill shadow-sm" style={{ fontSize: "16px" }}>
                                Guardar Perfil
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FreelancerForm;