import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResults = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (query) {
      actions.setSearchQuery(query);
      actions.searchBySkill(query);
    }
  }, [query]);

  const freelancers = store.searchResults.freelancers;
  const projects = store.searchResults.projects;


  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Resultados para: <span className="text-secondary">"{store.searchQuery}"</span></h2>
        <button className="btn btn-outline-dark" onClick={() => navigate("/")}>
          Volver al Home
        </button>
      </div>

      <h4 className="mb-3 text-dark">Freelancers:</h4>

      <div className="row">
        {freelancers.length > 0 ? freelancers.map((f) => (
          <div key={f.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border border-light">
              <div className="card-body d-flex flex-column">
                <div className="text-center mb-3">
                  <img
                    src={f.profile_picture || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                </div>
                <h5 className="card-title text-dark text-center mb-2">
                  {f.user.first_name} {f.user.last_name}
                </h5>
                <p className="card-text text-muted text-center" style={{ minHeight: "60px" }}>
                  {f.bio || "Sin biografía disponible."}
                </p>
                <div className="text-center mt-auto">
                  <button
                    className="btn btn-dark w-100"
                    onClick={() => navigate(`/Profile/${f.user.id}`)}
                  >
                    Ver perfil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-muted text-center mt-5">No se encontraron freelancers para esta skill.</div>
        )}
      </div>
      <h4 className="mb-3 text-dark mt-5">Proyectos disponibles:</h4>

        <div className="row">
          {projects.length > 0 ? projects.map((p) => (
            <div key={p.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border border-light">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark">{p.title}</h5>
                  <p className="card-text text-muted" style={{ minHeight: "60px" }}>
                    {p.description || "Sin descripción disponible."}
                  </p>
                  <p className="small"><strong>Presupuesto:</strong> ${p.budget}</p>
                  <p className="small"><strong>Estado:</strong> {p.status}</p>
                  <div className="mt-auto text-end">
                    <button className="btn btn-outline-dark btn-sm" disabled>
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-muted text-center mt-5">No se encontraron proyectos con esta skill.</div>
          )}
        </div>

    </div>
  );
};

export default SearchResults;
