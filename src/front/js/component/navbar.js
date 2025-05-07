import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from './../../../../public/Logo SkillMatch.png';

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      actions.setSearchQuery(query);
      await actions.searchBySkill(query);
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setSearchTerm("");
    }
  };


  return (
    <div className="container-fluid">
      <nav className="navbar">
        <div className="container-fluid navStyles">
          <Link to={"/"} className="navbar-brand">
            <img src={logo} alt="Bootstrap" width="42" height="42" />
          </Link>

          <div className="navbar-nav navOptions col d-flex flex-row">
            <Link to={"/dashboard"} className="nav-link active ms-2 me-3 text-black">Dashboard</Link>
            <Link to={"/About"} className="nav-link active ms-2 me-3 text-black">About</Link>
            <Link to={"/Contact"} className="nav-link active ms-2 me-3 text-black">Contact</Link>
          </div>

          <form className="d-flex me-4" role="search" onSubmit={handleSearchSubmit}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search"
            />
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
