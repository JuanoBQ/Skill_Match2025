import React from 'react';

const EmployerProfile = () => {
  //  Datos simulados dentro del mismo componente
  const user = {
    role: 'employer',
    first_name: 'Miguel',
    last_name: 'Cabrera',
    projects: [
      {
        id: 1,
        title: 'Plataforma e-commerce para ropa',
        status: 'open',
        budget: 800
      },
      {
        id: 2,
        title: 'Aplicación para control de empleados',
        status: 'completed',
        budget: 1200
      }
    ]
  };

  const fullName = `${user.first_name} ${user.last_name}`;
  const projects = user.projects;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Perfil del Empleador</h2>

      <div className="card">
        <div className="card-body">
          <h4 className="text-center">{fullName}</h4>

          <strong>Proyectos publicados:</strong>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <strong>{project.title}</strong> - Estado: {project.status} - Presupuesto: ${project.budget}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
