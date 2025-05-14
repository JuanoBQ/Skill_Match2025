import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const Register = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      error: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword, role } = formData;


    if (!firstName || !lastName || !email || !password || !role) {
      return Swal.fire({ icon: 'error', title: 'Ups...', text: 'Por favor, completa todos los campos.' });}

    if (!/\S+@\S+\.\S+/.test(email)) {
      return Swal.fire({ icon: 'error', title: 'Email inválido', text: 'Por favor, ingresa un correo electrónico válido.' });}

    if (password.length < 6) {
      return Swal.fire({ icon: 'error', title: 'Contraseña muy corta', text: 'La contraseña debe tener al menos 6 caracteres.' });}

    if (password !== confirmPassword) {
      return Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden.' });}


    const response = await actions.register(email, password, role, firstName, lastName);

    if (response.success) {
      await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Ya puedes iniciar sesión",
        confirmButtonText: "Ir a Login"
      });
      navigate("/login");
    } else {
      await Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: response.error || "Ocurrió un problema",
        confirmButtonText: "Ok"
      });
    }
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
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
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirma tu contraseña"
                    name="confirmPassword"
                    value={formData.confirmPassword}
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
                    <option value="employer">Empleador</option>
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

export default Register;