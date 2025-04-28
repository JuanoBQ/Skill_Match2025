
import React from 'react';
export const Jumbotron = () => {
    return (
        <div className="d-flex justify-content-center">
        <div className="container mb-4 bg-light rounded-3 mx-5 mt-4">
            <div className="ps-5 container-fluid py-5 text-start">
                <h1 className="display-5 fw-bold">Bienvenido a SkillMatch!</h1>
                <p className="col-md-8 fs-4">
                Conectamos talento con oportunidades. Encuentra al freelancer ideal o el
                proyecto que impulse tu carrera, todo en un entorno confiable, ágil y justo.
                ¡Tu próxima oportunidad comienza aquí!
                </p>
                <button className="btn btn-primary btn-lg" type="button">
                    Empezar ahora
                </button>
            </div>
        </div>
        </div>
    );
};