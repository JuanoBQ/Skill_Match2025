import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí podrías integrar una API o lógica para enviar el formulario
        console.log('Formulario enviado:', formData);
        alert('Gracias por contactarnos. Te responderemos pronto.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="text-center mb-4">
                <h1>Contáctanos</h1>
                <p className="lead">¿Tienes preguntas o sugerencias? ¡Estamos aquí para ayudarte!</p>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '600px' }}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="message" className="form-label">Mensaje</label>
                    <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">Enviar</button>
            </form>

            <div className="text-center mt-5">
                <h5>Síguenos en nuestras redes</h5>
                <div className="d-flex justify-content-center gap-4 mt-3">
                    <div className="text-center">
                        <FaFacebook size={30} />
                        <p className="mb-0">SkillMatch</p>
                    </div>
                    <div className="text-center">
                        <FaInstagram size={30} />
                        <p className="mb-0">SkillMatch</p>
                    </div>
                    <div className="text-center">
                        <FaLinkedin size={30} />
                        <p className="mb-0">SkillMatch</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

