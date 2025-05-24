import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from './../../../../public/Logo SkillMatch.png';
import Select from "react-select";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    actions.getSkills().then(res => {
      if (res.success) {
        setAvailableSkills(
          res.skills.map(s => ({ value: s.name, label: s.name }))
        );
      }
    });
  }, []);

  useEffect(() => {
    console.log("🌀 STORE CAMBIÓ ->", store);
  }, [store.isAuthenticated]);

  const handleLogout = () => {
    actions.logout();
    navigate('/login');
  };

  const goToProfile = () => {
    const currentRole = store.role;
    if (currentRole === "freelancer") {
      navigate('/freelancerProfile');
    } else if (currentRole === "employer") {
      navigate('/employerProfile');
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (selectedSkills.length > 0) {
      const query = selectedSkills.map(s => s.value).join(",");
      actions.setSearchQuery(query);
      setIsSearching(true);
      const res = await actions.searchBySkill(query);
      setIsSearching(false);

      if (res.success) {
        navigate(`/search?query=${encodeURIComponent(query)}`);
      } else {
        alert("Ocurrió un error al buscar.");
      }
    }
  };

  const clearSearch = () => {
    setSelectedSkills([]);
    actions.setSearchQuery("");
  };

  return (
    <div className="container-fluid">
      <nav className="navbar">
        <div className="container-fluid navStyles">
          <Link to={"/"} className="navbar-brand">
            <img src={logo} alt="Logo SkillMatch" width="42" height="42" />
          </Link>

          <div className="navbar-nav navOptions col d-flex flex-row">
            <Link to={"/dashboard"} className="nav-link active ms-2 me-3 text-black">Dashboard</Link>
            <Link to={"/About"} className="nav-link active ms-2 me-3 text-black">Acerca de Nosotros</Link>
            <Link to={"/Contact"} className="nav-link active ms-2 me-3 text-black">Contacto</Link>
          </div>

          <form className="d-flex me-4" onSubmit={handleSearchSubmit}>
            <div style={{ width: "250px" }}>
              <Select
                isMulti
                options={availableSkills}
                value={selectedSkills}
                onChange={setSelectedSkills}
                placeholder="Buscar skills..."
              />
            </div>
            <button
              className="btn btn-outline-dark ms-2"
              type="submit"
              disabled={isSearching}
            >
              {isSearching ? (
                <span className="spinner-border spinner-border-sm" role="status" />
              ) : (
                <i className="fa-solid fa-magnifying-glass"></i>
              )}
            </button>
            {selectedSkills.length > 0 && (
              <button
                className="btn btn-outline-secondary ms-2"
                type="button"
                onClick={clearSearch}
              >
                Limpiar
              </button>
            )}
          </form>

          <div>
            {store.isAuthenticated ? (
              <>
                <button onClick={goToProfile} className="btn btn-info px-4 py-2 me-2">
                  <i className="fa-solid fa-user" style={{ color: "#ffffff" }}></i> Mi Perfil
                </button>
                <button onClick={handleLogout} className="btn btn-danger px-4 py-2">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="btn btn-dark px-4 py-2 me-2">Iniciar sesión</button>
                </Link>
                <Link to="/register">
                  <button className="btn btn-dark px-4 py-2">Registrarse</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
