import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [skills, setSkills] = useState([]); // Todas las skills disponibles
  const [selectedSkills, setSelectedSkills] = useState([]); // Skills seleccionadas

  // Cargar skills y perfil al iniciar
  useEffect(() => {
    const fetchData = async () => {
      const resSkills = await actions.getSkills();
      if (resSkills.success) {
        setSkills(resSkills.skills);
      }

      if (store.userId) {
        const resProfile = await actions.getFreelancerProfile(store.userId);
        if (resProfile.success && resProfile.profile) {
          const profileData = resProfile.profile;
          setBio(profileData.bio || "");
          setHourlyRate(profileData.hourly_rate || "");
          setProfilePicture(profileData.profile_picture || "");

          if (profileData.skills && profileData.skills.length > 0) {
            const skillIds = profileData.skills.map((fs) => fs.skill?.id).filter(Boolean);
            setSelectedSkills(skillIds);
          }
        }
      }
    };

    if (store.userId) {
      fetchData();
    }
  }, [store.userId]);

  const handleSkillToggle = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      // Si ya está seleccionada, la quitamos
      setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
    } else {
      // Si no, la agregamos
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = store.userId;

    if (!userId) {
      console.error("No hay usuario logueado");
      return;
    }

    // 1. Crear o actualizar perfil
    const resProfile = await actions.createOrUpdateProfile(userId, {
      bio,
      profile_picture: profilePicture,
      hourly_rate: parseFloat(hourlyRate),
    });

    if (!resProfile.success) {
      alert("Error al crear o actualizar perfil.");
      return;
    }

    // 2. Eliminar TODAS las skills actuales antes
    await actions.clearFreelancerSkills(userId);

    // 3. Asignar skills seleccionadas
    if (selectedSkills.length > 0) {
      const resSkills = await actions.addFreelancerSkills(userId, selectedSkills);
      if (!resSkills.success) {
        alert("Error al agregar skills.");
        return;
      }
    }

    // 4. Navegar de regreso al perfil
    navigate("/freelancerProfile");
  };


  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Editar Perfil</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Biografía</label>
          <textarea
            className="form-control"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Escribe sobre ti..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tarifa por hora (USD)</label>
          <input
            type="number"
            className="form-control"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="Ej: 30"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Portafolio (URL)</label>
          <input
            type="text"
            className="form-control"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            placeholder="URL de tu portafolio"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Skills</label>
          <div className="d-flex flex-wrap">
            {skills.map((skill) => (
              <div key={skill.id} className="form-check me-4 mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`skill-${skill.id}`}
                  checked={selectedSkills.includes(skill.id)}
                  onChange={() => handleSkillToggle(skill.id)}
                />
                <label className="form-check-label" htmlFor={`skill-${skill.id}`}>
                  {skill.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Guardar Perfil
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
