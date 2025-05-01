import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

// Importa los iconos correspondientes de react-icons
import { FaJsSquare, FaPython, FaReact, FaVuejs, FaAngular, FaNodeJs, FaJava, FaCuttlefish, FaPhp, FaGem, FaDatabase } from "react-icons/fa";

const ProfileForm = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkillOptions, setSelectedSkillOptions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [skillsRes, profileRes] = await Promise.all([
        actions.getSkills(),
        actions.getFreelancerProfile(store.userId)
      ]);

      if (skillsRes.success) {
        const options = skillsRes.skills.map(skill => {
          let icon = null;
          // Asigna íconos dependiendo de la habilidad
          switch(skill.name) {
            case "JavaScript":
              icon = <FaJsSquare />;
              break;
            case "Python":
              icon = <FaPython />;
              break;
            case "React":
              icon = <FaReact />;
              break;
            case "Vue.js":
              icon = <FaVuejs />;
              break;
            case "Angular":
              icon = <FaAngular />;
              break;
            case "Node.js":
              icon = <FaNodeJs />;
              break;
            case "Java":
              icon = <FaJava />;
              break;
            case "C#":
              icon = <FaCuttlefish />;
              break;
            case "PHP":
              icon = <FaPhp />;
              break;
            case "Ruby on Rails":
              icon = <FaGem />;
              break;
            case "MongoDB":
              icon = <FaDatabase />;
              break;
            case "SQL":
              icon = <FaDatabase />;
              break;
            case "PostgreSQL":
              icon = <FaDatabase />;
              break;
            case "MySQL":
              icon = <FaDatabase />;
              break;
            case "Laravel":
              icon = <FaPhp />;
              break;
            case "Express.js":
              icon = <FaNodeJs />;
              break;
            case "Swift":
              icon = <FaReact />;
              break;
            default:
              icon = null;
          }

          return {
            value: skill.id,
            label: (
              <div className="d-flex align-items-center">
                {icon && <span className="me-2">{icon}</span>}  {/* Muestra el ícono y el nombre */}
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
        setProfilePicture(profile.profile_picture || "");

        // Filtra las skills existentes que estén en las disponibles
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = store.userId;
    if (!userId) return alert("No hay usuario activo");

    const resProfile = await actions.createOrUpdateProfile(userId, {
      bio,
      profile_picture: profilePicture,
      hourly_rate: parseFloat(hourlyRate),
    });

    if (!resProfile.success) return alert("Error al actualizar perfil");

    await actions.clearFreelancerSkills(userId);

    const skillIds = selectedSkillOptions.map(option => option.value);
    if (skillIds.length > 0) {
      const resSkills = await actions.addFreelancerSkills(userId, skillIds);
      if (!resSkills.success) return alert("Error al asignar skills");
    }

    navigate("/freelancerProfile");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark">Editar Perfil</h2>
      <div className="card shadow-lg border-0 rounded-4 mb-4" style={{ maxWidth: "50rem", margin: "auto" }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Biografía</label>
              <textarea
                className="form-control"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
                style={{ borderRadius: "10px" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tarifa por hora (USD)</label>
              <input
                type="number"
                className="form-control"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                style={{ borderRadius: "10px" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Foto de Perfil (URL)</label>
              <input
                type="text"
                className="form-control"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                style={{ borderRadius: "10px" }}
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
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "10px",
                    borderColor: "#ced4da"
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#f1f1f1",
                    borderRadius: "10px"
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#000"
                  })
                }}
              />
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-info w-100 py-2 rounded-pill shadow-sm"
                style={{ fontSize: "16px" }}
              >
                Guardar Perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
