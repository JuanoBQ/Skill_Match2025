import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../store/appContext';


const DashboardFilter = () => {
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');

  const { store, actions } = useContext(Context)

  useEffect(() => {
    actions.getSkills()
    actions.dashboardFilterBy(category, rating, location, hourlyRate, skills)
  }, [category, rating, location, hourlyRate, skills])

  const handleReset = () => {
    setCategory("")
    setRating("")
    setHourlyRate("")
    setSkills("")
    setLocation("")
  }

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
                  <option value="">Selecciona una categoria</option>
                  <option value="Web Developer">Web Developer</option>
                  <option value="Graphic Designer">Graphic Designer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Mobile App Developer">Mobile App Developer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Fullstack Developer">Fullstack Developer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Content Writer">Content Writer</option>
                  <option value="Copywriter">Copywriter</option>
                  <option value="SEO Specialist">SEO Specialist</option>
                  <option value="Digital Marketer">Digital Marketer</option>
                  <option value="Video Editor">Video Editor</option>
                  <option value="Photographer">Photographer</option>
                  <option value="Illustrator">Illustrator</option>
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
                <label htmlFor="location" className="form-label">Ubicacion</label>
                <select
                  id="location"
                  className="form-select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Selecciona un país</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Brasil">Brasil</option>
                  <option value="Chile">Chile</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Perú</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Venezuela">Venezuela</option>
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
                <select
                  id="rating"
                  className="form-select"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                >
                  <option value="">Selecciona una skill</option>
                  {store.skills ? store.skills.map((skill) => { return <option key={skill.id} value={skill.name} >{skill.name}</option> }) : ("No options")}
                </select>
              </div>

              <button
                className="btn btn-outline-primary px-4 py-2"
                onClick={() => handleReset()}

              >
                Limpiar
              </button>
            </div>
          </div>
        </div>


      </div>
    </div >
  );
};

export default DashboardFilter;
