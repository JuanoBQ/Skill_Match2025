import React, { useEffect, useState } from 'react';

const DashboardFilter = () => {
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [skills, setSkills] = useState('');

  useEffect(()=>{
    
  },[])


  return (
    <div className="card m-0 mt-4 shadow-sm border border-0 background" style={{ maxWidth: "22rem" }}>
      <div className="row">

        <div>
          <div className="card shadow-sm rounded-3">
            <div className="card-body">
              <h5 className="card-title mb-4">Filtrar por</h5>


              <div className="mb-3">
                <label htmlFor="category" className="form-label">Categoría</label>
                <select
                  id="category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Fullstack Developer">Fullstack Developer</option>
                  <option value="Devops Engineer">Devops Engineer</option>

                  
                  <option value="Graphic Designer">Graphic Designer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Illustrator">Illustrator</option>

              
                  <option value="SEO Specialist">SEO Specialist</option>
                  <option value="Digital Marketer">Digital Marketer</option>

                 
                  <option value="Content Writer">Content Writer</option>
                  <option value="Copywriter">Copywriter</option>

                  <option value="Video Editor">Video Editor</option>
                  <option value="Photographer">Photographer</option>

             
                  <option value="Translator">Translator</option>
                  <option value="Virtual Assistant">Virtual Assistant</option>

                
                  <option value="Project Manager">Project Manager</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="rating" className="form-label">Rating</label>
                <select
                  id="rating"
                  className="form-select"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Selecciona un rating</option>
                  <option value="1">1 estrella</option>
                  <option value="2">2 estrellas</option>
                  <option value="3">3 estrellas</option>
                  <option value="4">4 estrellas</option>
                  <option value="5">5 estrellas</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="hourlyRate" className="form-label">Costo por Hora</label>
                <input
                  id="hourlyRate"
                  type="number"
                  className="form-control"
                  placeholder="Ingresa el costo por hora"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
              </div>


              <div className="mb-3">
                <label htmlFor="skills" className="form-label">Skills</label>
                <input
                  id="skills"
                  type="text"
                  className="form-control"
                  placeholder="Ingresa habilidades separadas por coma"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default DashboardFilter;
