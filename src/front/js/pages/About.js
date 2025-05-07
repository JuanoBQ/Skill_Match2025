import React from 'react';

export const About = () => {
    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h1 className="display-4">Acerca de SkillMatch</h1>
                <p className="lead">Conectando talento con oportunidad.</p>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <h3>Nuestra Misión</h3>
                    <p>
                        En SkillMatch, creemos que el talento no tiene fronteras. Nuestra misión es construir un puente entre freelancers altamente capacitados y empleadores visionarios, creando oportunidades reales para ambos lados del mercado laboral.
                    </p>
                </div>
                <div className="col-md-6">
                    <h3>¿Qué es SkillMatch?</h3>
                    <p>
                        SkillMatch es una plataforma intuitiva que permite a empleadores publicar proyectos y a freelancers ofrecer sus servicios en distintas áreas como desarrollo web, diseño gráfico, redacción, marketing y más. Facilitamos el proceso de conexión, comunicación y colaboración para que cada proyecto sea un éxito.
                    </p>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <h3>Para Freelancers</h3>
                    <p>
                        Crea tu perfil, muestra tus habilidades, y encuentra proyectos que se ajusten a tu experiencia y pasión. Nuestra comunidad te permite crecer profesionalmente y construir relaciones laborales duraderas.
                    </p>
                </div>
                <div className="col-md-6">
                    <h3>Para Empleadores</h3>
                    <p>
                        Publica ofertas de trabajo, descubre profesionales calificados y lleva tus proyectos al siguiente nivel. SkillMatch te ayuda a encontrar el freelancer ideal en cuestión de minutos.
                    </p>
                </div>
            </div>

            <div className="mt-5 text-center">
                <h4>Únete a la comunidad SkillMatch</h4>
                <p>
                    Ya sea que estés buscando tu próximo desafío o al profesional perfecto, SkillMatch es el lugar para comenzar. Nuestro objetivo es facilitar el encuentro entre el talento y la necesidad.
                </p>
            </div>
        </div>
    );
};


