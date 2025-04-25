import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Register = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
    gender: '',
    age: '',
    role: '',
    error: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      error: '' // limpia el error al escribir
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, company, gender, age, role } = formData;

    // Validaciones
    if (!firstName || !lastName || !email || !password || !company || !gender || !age || !role) {
      setFormData((prevData) => ({ ...prevData, error: 'Por favor, completa todos los campos.' }));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormData((prevData) => ({ ...prevData, error: 'Por favor, ingresa un correo electrónico válido.' }));
      return;
    }

    if (password.length < 6) {
      setFormData((prevData) => ({ ...prevData, error: 'La contraseña debe tener al menos 6 caracteres.' }));
      return;
    }

    // Llamar al action register
    const response = await actions.register(email, password, role,firstName, lastName);

    if (response.success) {
      navigate('/login');
    } else {
      setFormData((prevData) => ({ ...prevData, error: response.error }));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center">Crear Cuenta</h3>
              {formData.error && <div className="alert alert-danger">{formData.error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">Nombres</label>
                  <input
                    type="text"
                    id="firstName"
                    className="form-control"
                    placeholder="Ingrese sus nombres"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Apellidos</label>
                  <input
                    type="text"
                    id="lastName"
                    className="form-control"
                    placeholder="Ingrese sus apellidos"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Ingrese su correo electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Ingrese una contraseña"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="company" className="form-label">Empresa (Opcional)</label>
                  <input
                    type="text"
                    id="company"
                    className="form-control"
                    placeholder="Ingrese el nombre de su empresa"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">Género</label>
                  <select
                    id="gender"
                    className="form-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione su género</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="age" className="form-label">Edad</label>
                  <input
                    type="number"
                    id="age"
                    className="form-control"
                    placeholder="Ingrese su edad"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Rol</label>
                  <select
                    id="role"
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione un rol</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="employer">Empresa</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-dark w-100">
                  Registrarse
                </button>
              </form>
            </div>
          </div>
          <div className='text-center mt-3'>Ya tienes una cuenta? <Link to={"/login"}><a className=''>Log In</a></Link></div>
        </div>
      </div>
    </div>
  );
};

export default Register;