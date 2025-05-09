import React from "react";
import { Link } from "react-router-dom";
import "../../styles/home.css";
import 'animate.css';
import user01 from './../../../../public/user01.png';
import user02 from './../../../../public/user02.png';
import user03 from './../../../../public/user03.png';
import Empresa1 from "./../../img/Empresas/Empresa 1.png"
import Empresa2 from "./../../img/Empresas/Empresa 2.png"
import Empresa3 from "./../../img/Empresas/Empresa 3.png"
import Empresa4 from "./../../img/Empresas/Empresa 4.png"
import Empresa5 from "./../../img/Empresas/Empresa 5.png"

const Home = () => {
	return (
		<div className="animate__animated animate__fadeIn">
			{/* Hero Banner Section */}
			<section className="hero-section">
				<div className="container">
					<div className="row">
						<div className="col-lg-6 col-md-12 hero-content">
							<h1>Encuentra el talento perfecto para tu proyecto</h1>
							<p className="hero-subtitle">
								Contrata a los mejores freelancers para cualquier trabajo, en línea.
							</p>
							<div className="search-container">
								<input
									type="text"
									placeholder="¿Qué servicio estás buscando?"
									className="search-input"
								/>
								<button className="search-btn">Buscar</button>
							</div>
							<div className="popular-searches">
								<span>Popular:</span>
								<Link to="#">Desarrollo Web</Link>
								<Link to="#">Diseño Gráfico</Link>
								<Link to="#">Marketing Digital</Link>
								<Link to="#">Redacción</Link>
							</div>
						</div>
						<div className="col-lg-6 col-md-12 hero-image">
							<img
								src="https://s36496.pcdn.co/wp-content/uploads/2022/12/guia-sector-it-02.jpg"
								alt="Profesional trabajando"
								className="img-fluid"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Empresas */}
			<section className="trusted-by">
				<div className="container">
					<h5 className="text-center">Empresas que confían en nosotros</h5>
					<div className="logos-container">
						<img src="/Empresa 1.png" alt="Company Logo" style={{ width: "80px", height: "80px" }} />
						<img src="/Empresa 2.png" alt="Company Logo" style={{ width: "80px", height: "80px" }} />
						<img src="/Empresa 3.png" alt="Company Logo" style={{ width: "80px", height: "80px" }} />
						<img src="/Empresa 4.png" alt="Company Logo" style={{ width: "80px", height: "80px" }} />
						<img src="/Empresa 5.png" alt="Company Logo" style={{ width: "80px", height: "80px" }} />
					</div>
				</div>
			</section>

			{/* Categorias */}
			<section className="categories-section">
				<div className="container">
					<h2>Explora las categorías principales</h2>
					<div className="categories-grid">
						<div className="category-card">
							<div className="category-icon">
								<i className="fas fa-laptop-code"></i>
							</div>
							<h3>Desarrollo & IT</h3>
							<p>Desarrollo web, móvil, testing y más</p>
						</div>
						<div className="category-card">
							<div className="category-icon">
								<i className="fas fa-paint-brush"></i>
							</div>
							<h3>Diseño & Creatividad</h3>
							<p>Diseño gráfico, UI/UX, ilustración</p>
						</div>
						<div className="category-card">
							<div className="category-icon">
								<i className="fas fa-chart-line"></i>
							</div>
							<h3>Marketing</h3>
							<p>SEO, redes sociales, email marketing</p>
						</div>
						<div className="category-card">
							<div className="category-icon">
								<i className="fas fa-pen"></i>
							</div>
							<h3>Redacción</h3>
							<p>Artículos, blogs, copywriting</p>
						</div>
					</div>
					<div className="text-center mt-4">
						<Link to="/categories" className="view-all-btn">Ver todas las categorías</Link>
					</div>
				</div>
			</section>

			{/* El Como */}
			<section className="how-it-works">
				<div className="container">
					<h2 className="text-center">Cómo funciona Skill Match</h2>
					<div className="steps-container">
						<div className="step-card">
							<div className="step-number">1</div>
							<h3>Publica un proyecto</h3>
							<p>Describe lo que necesitas y recibe propuestas en minutos</p>
						</div>
						<div className="step-card">
							<div className="step-number">2</div>
							<h3>Selecciona talentos</h3>
							<p>Revisa perfiles y elige al mejor profesional</p>
						</div>
						<div className="step-card">
							<div className="step-number">3</div>
							<h3>Colabora eficientemente</h3>
							<p>Utiliza nuestra plataforma para comunicación y pagos seguros</p>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonios */}
			<section className="testimonials">
				<div className="container">
					<h2 className="text-center">Lo que dicen nuestros usuarios</h2>
					<div className="row">
						<div className="col-lg-4 col-md-6">
							<div className="testimonial-card">
								<div className="testimonial-content">
									<p>"Encontré el desarrollador perfecto en solo 48 horas. La calidad del trabajo superó mis expectativas."</p>
								</div>
								<div className="testimonial-author">
									<img src="/user02.png" alt="Freelancer 3" className="author-img" />
									<div>
										<h4>María González</h4>
										<p>CEO, TechStartup</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-4 col-md-6">
							<div className="testimonial-card">
								<div className="testimonial-content">
									<p>"La plataforma me permitió encontrar proyectos interesantes y clientes que valoran mi trabajo."</p>
								</div>
								<div className="testimonial-author">
									<img src="/user01.png" alt="Freelancer 2" className="author-img" />
									<div>
										<h4>Carlos Rodríguez</h4>
										<p>Diseñador UX/UI</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-4 col-md-6">
							<div className="testimonial-card">
								<div className="testimonial-content">
									<p>"Skill Match nos ayudó a escalar nuestro equipo rápidamente con talento de alta calidad."</p>
								</div>
								<div className="testimonial-author">
									<img src="/user03.png" alt="Freelancer 1" className="author-img" />
									<div>
										<h4>Andres Silva</h4>
										<p>Director de Proyecto, GrowthCorp</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Estadisticas */}
			<section className="stats-section">
				<div className="container">
					<div className="stats-container">
						<div className="stat-item">
							<h2>+10,000</h2>
							<p>Freelancers activos</p>
						</div>
						<div className="stat-item">
							<h2>+5,000</h2>
							<p>Empresas registradas</p>
						</div>
						<div className="stat-item">
							<h2>+25,000</h2>
							<p>Proyectos completados</p>
						</div>
						<div className="stat-item">
							<h2>97%</h2>
							<p>Clientes satisfechos</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="cta-section">
				<div className="container">
					<div className="row">
						<div className="col-md-6">
							<div className="cta-card client-cta">
								<h2>Para empresas</h2>
								<p>Encuentra profesionales talentosos para cualquier proyecto y escala tu negocio.</p>
								<Link to="/register" className="cta-btn">Contratar talento</Link>
							</div>
						</div>
						<div className="col-md-6">
							<div className="cta-card freelancer-cta">
								<h2>Para freelancers</h2>
								<p>Encuentra proyectos que se adapten a tus habilidades y experiencia.</p>
								<Link to="/register" className="cta-btn">Encuentra trabajo</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;