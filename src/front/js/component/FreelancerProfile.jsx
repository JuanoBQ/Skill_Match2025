import React from 'react';

const FreelancerProfile = () => {
  // 👇 Datos simulados directamente aquí
  const user = {
    role: 'freelancer',
    first_name: 'Ana',
    last_name: 'Gómez',
    profile: {
      bio: 'Soy desarrolladora full stack con 3 años de experiencia.',
      profile_picture: '', // o usa una URL como 'https://i.pravatar.cc/150?img=5'
      hourly_rate: 35,
      rating: 4.8,
      skills: [
        { skill: { id: 1, name: 'React' } },
        { skill: { id: 2, name: 'Python' } },
        { skill: { id: 3, name: 'PostgreSQL' } }
      ]
    }
  };

  const fullName = `${user.first_name} ${user.last_name}`;
  const profile = user.profile;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Perfil del Freelancer</h2>

      <div className="card">
        <div className="card-body">
          <div className="text-center mb-3">
            <img
              src={profile?.profile_picture || '/default.jpg'}
              alt="Foto de perfil"
              width="120"
              className="rounded-circle"
            />
          </div>

          <h4 className="text-center">{fullName}</h4>
          <p><strong>Biografía:</strong> {profile?.bio}</p>
          <p><strong>Tarifa por hora:</strong> ${profile?.hourly_rate}</p>
          <p><strong>Calificación:</strong> {profile?.rating}</p>

          <div>
            <strong>Habilidades:</strong>
            <ul>
              {profile.skills.map((fs) => (
                <li key={fs.skill.id}>{fs.skill.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
