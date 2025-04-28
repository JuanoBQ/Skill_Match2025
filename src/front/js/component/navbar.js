import React, { useContext,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from './../../../../public/Logo SkillMatch.png';

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  useEffect(() => {
	console.log("🌀 STORE CAMBIÓ ->", store);
  }, [store.isAuthenticated]);
  


  const handleLogout = () => {
    actions.logout();
    navigate('/login');
  };

  const goToProfile = () => {
	const currentRole = store.role;
	console.log("Rol actual en el store:", currentRole);
  
	if (currentRole === "freelancer") {
	  console.log("Redirigiendo a /freelancerProfile");
	  navigate('/freelancerProfile');
	} else if (currentRole === "employer") {
	  console.log("Redirigiendo a /employerProfile");
	  navigate('/employerProfile');
	} else {
	  console.log("Rol no encontrado. No se puede redirigir.");
	}
  };
  

  const goToFreelancers = () => {

      navigate('/Dashboard');
 
    };

  const goToProjects = () => {

      navigate('/DashboardProjects');
 
  };

  return (
    <div className="container-fluid">
      <nav className="navbar">
        <div className="container-fluid navStyles">
          <Link to={"/"}>
            <a className="navbar-brand" href="#">
              <img src={logo} alt="Bootstrap" width="42" height="42" />
            </a>
          </Link>

          <div className="navbar-nav navOptions col d-flex flex-row">
            <Link to={"/dashboard"} className="nav-link active ms-2 me-3">Dashboard</Link>
            <a className="nav-link me-3" href="#">About</a>
            <a className="nav-link me-3" href="#">Services</a>
            <a className="nav-link me-3" href="#">Contact</a>

            {store.isAuthenticated ? (
             <div class="dropdown">
             <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
               Services
             </button>
             <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
               <li><a class="dropdown-item" href="#" onClick={goToFreelancers}>Freelancers</a></li>
               <li><a class="dropdown-item" href="#" onClick={goToProjects}>Projects</a></li>
             </ul>
           </div>
            ) : null}
          </div>

         
          <form className="d-flex me-4" role="search">
            <input className="form-control me-2" type="search" aria-label="Search" />
            <button className="btn btn-outline-dark" type="submit" aria-label="Search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>

          <div>
            {store.isAuthenticated ? (
              <>
                <button onClick={goToProfile} className="btn btn-info px-4 py-2 me-2">
                  Mi Perfil
                </button>
                <button onClick={handleLogout} className="btn btn-danger px-4 py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button type="button" className="btn btn-dark px-4 py-2 me-2">Log in</button>
                </Link>
                <Link to="/register">
                  <button type="button" className="btn btn-dark px-4 py-2">Sign up</button>
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>
    </div>
  );
};
