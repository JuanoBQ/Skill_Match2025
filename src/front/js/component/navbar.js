import React, { useContext,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

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
  

  return (
    <div className="container-fluid">
      <nav className="navbar">
        <div className="container-fluid navStyles">
          <Link to={"/"}>
            <a className="navbar-brand" href="#">
              <img src="https://demo.themetorium.net/html/nui/assets/img/logo-dark.png" alt="Bootstrap" width="42" height="38" />
            </a>
          </Link>

          <div className="navbar-nav navOptions col d-flex flex-row">
            <Link className="nav-link active ms-2 me-3" to="/">Home</Link>
            <a className="nav-link me-3" href="#">About</a>
            <a className="nav-link me-3" href="#">Services</a>
            <a className="nav-link" href="#">Contact</a>
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
                <button onClick={goToProfile} className="btn btn-dark px-4 py-2 me-2">
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
