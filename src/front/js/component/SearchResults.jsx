import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useLocation, useNavigate } from "react-router-dom";
import undefinedImage from "./../../../front/img/User_Undefined.jpg";
import "./../../styles/index.css";

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
  console.log(freelancers[0])
  const readMore = (bio) => {
    if (bio.length > 150) return bio.slice(0, 150) + "...";
    return bio;
  };
  const projects = store.searchResults.projects;


  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">
          Resultados para: <span className="text-secondary">"{store.searchQuery}"</span>
        </h2>
        <button className="btn btn-outline-dark" onClick={() => navigate("/")}>
          Volver al Home
        </button>
      </div>

      <h4 className="mb-3 text-dark">Freelancers:</h4>

      <div className="row">
        {freelancers.length > 0 ? (
          freelancers.map((f) => (
            <div key={f.id} className="col-12 col-sm-6 col-lg-4 mb-4">
              <div
                className="card shadow-sm border border-light d-flex flex-column"
                style={{
                  aspectRatio: "1 / 1",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="card-body d-flex flex-column freelancer-card shadow-sm border-light">
                  <div className="d-flex flex-row align-items-center mb-3">
                    <img
                      src={f.profile_picture}
                      alt="Profile"
                      className="rounded-circle me-3"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <h5 className="card-title text-dark text-center mb-2">
                    {f.user.first_name} {f.user.last_name}
                  </h5>
                  </div>
                  
                  <p
                    className="card-text text-muted"
                    style={{ flexGrow: 1, overflow: "hidden" }}
                  >
                    {readMore(f.bio)}
                  </p>
                  <strong className="text-dark mb-0">Habilidades:</strong><br></br>
                  <div className="text-dark mb-0 mt-0">
                    {f.skills.map((skill) => {
                      return <div className="badge bg-secondary me-1 mt-0">{skill.name}</div>
                    })}
                  </div>
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-info w-100"
                      onClick={() => navigate(`/profile/${f.user.id}`)}
                    >
                      Ver perfil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted text-center mt-5">
            No se encontraron freelancers para esta skill.
          </div>
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
