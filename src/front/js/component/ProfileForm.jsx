import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

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
        const options = skillsRes.skills.map(skill => ({
          value: skill.id,
          label: skill.name
        }));
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
      <h2 className="mb-4 text-center">Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Biografía</label>
          <textarea className="form-control" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Tarifa por hora (USD)</label>
          <input
            type="number"
            className="form-control"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Foto de Perfil (URL)</label>
          <input
            type="text"
            className="form-control"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
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

        <button type="submit" className="btn btn-dark w-100">
          Guardar Perfil
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
