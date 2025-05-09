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
            <div key={f.id} className="col-12 col-sm-6 col-lg-4 mb-4 d-flex justify-content-center">
              <div className="card shadow-sm border-0" style={{
                aspectRatio: "1/1"
              }}>
                <div className="card-body d-flex flex-column">
                  <div className="d-flex flex-row align-items-center mb-3">
                    <img
                      src={f.profile_picture}
                      alt="Profile"
                      className="rounded-circle me-3"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)"
                      }}
                    />
                    <h5 className="text-dark fw-bold mb-2">{f.user.first_name} {f.user.last_name}</h5>
                  </div>

                  <div className="bio-section">
                    <p className="card-text text-muted mb-2" style={{
                      width: "100%",
                      height: "120px",

                    }}>
                      {readMore(f.bio)}
                    </p>
                  </div>

                  <div className="skills-section">
                    <strong className="text-dark mt-2">Habilidades:</strong>
                    <div className="text-dark mb-3 mt-1 d-flex flex-wrap" style={{ maxHeight: "60px", overflowY: "auto" }}>
                      {f.skills.map((skill, index) => (
                        <div key={index} className="badge bg-dark text-light me-2 mb-1">{skill.name}</div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center mt-auto">
                    <button
                      className="btn btn-info w-100 btn-sm"
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
          <div className="text-muted text-center mt-5">No se encontraron freelancers para esta skill.</div>
        )}
      </div>

      <h4 className="mb-3 text-dark mt-5">Proyectos disponibles:</h4>

      <div className="row">
        {projects.length > 0 ? projects.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-lg-4 mb-4 d-flex justify-content-center">
            <div className="card shadow-sm border-0" style={{
              aspectRatio: "1/1"
            }}>
              <div className="card-body d-flex flex-column">
                <h5 className="text-dark fw-bold mb-2">{p.title}</h5>
                <p className="text-muted mb-2" style={{
                  width: "100%",
                  height: "120px",

                }}>
                  {readMore(p.description) || "Sin descripción disponible."}
                </p>

                <p className="text-dark m-0"><strong>Presupuesto:</strong> ${p.budget}</p>
                <p className="text-dark m-0"><strong>Estado:</strong> {p.status}</p>

                {p.skills && p.skills.length > 0 && (
                  <>
                    <strong className="text-dar mb-1">Habilidades:</strong>
                    <div className="d-flex flex-wrap mb-3" style={{ maxHeight: "60px", overflowY: "auto" }}>

                      {p.skills.map((skill) => (
                        <span key={skill.id} className="badge bg-dark text-light me-2 mb-1">{skill.name}</span>
                      ))}
                    </div>
                  </>
                )}

                <div className="text-center mt-auto">
                  <button
                    className="btn btn-info w-100 btn-sm"
                    onClick={() => navigate(`/project/${p.id}`)}
                  >
                    Ver perfil
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
