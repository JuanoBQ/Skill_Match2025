import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useLocation, useNavigate } from "react-router-dom";
import undefinedImage from "./../../../front/img/User_Undefined.jpg";

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

  const readMore = (text) => {
    return text?.length > 150 ? text.slice(0, 150) + "..." : text;
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">
          Resultados para:{" "}
          <span className="text-secondary">"{store.searchQuery}"</span>
        </h2>
        <button
          className="btn btn-outline-dark"
          onClick={() => navigate("/")}
        >
          Volver al Home
        </button>
      </div>

      {/* FREELANCERS */}
      <h4 className="mb-3 text-dark">Freelancers:</h4>
      <div className="row">
        {freelancers.length > 0 ? (
          freelancers.map((f) => (
            <div
              key={f.id}
              className="col-12 col-sm-6 col-lg-4 mb-4 d-flex justify-content-center"
            >
              <div
                className="card shadow-sm border-0"
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "16px",
                  aspectRatio: "1 / 1",
                }}
              >
                <div className="card-body d-flex flex-column">
                  <div className="d-flex flex-row align-items-center mb-3">
                    <img
                      src={f.profile_picture || undefinedImage}
                      alt="Profile"
                      className="rounded-circle me-3"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                      }}
                    />
                    <h5 className="text-dark fw-bold mb-0">
                      {f.user.first_name} {f.user.last_name}
                    </h5>
                  </div>

                  <p className="text-muted mb-2" style={{ height: "100px" }}>
                    {readMore(f.bio)}
                  </p>

                  <div>
                    <p className="text-dark fw-bold mb-1">Habilidades:</p>
                    <div className="d-flex flex-wrap" style={{ maxHeight: "60px", overflowY: "auto" }}>
                      {f.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="badge bg-dark text-light me-2 mb-1"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn btn-info btn-sm w-100 mt-auto"
                    onClick={() => navigate(`/profile/${f.user.id}`)}
                  >
                    Ver perfil
                  </button>
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

      {/* PROYECTOS */}
      <h4 className="mb-3 text-dark mt-5">Proyectos disponibles:</h4>
      <div className="row">
        {projects.length > 0 ? (
          projects.map((p) => (
            <div
              key={p.id}
              className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center"
            >
              <div
                className="card shadow-sm border-0"
                style={{ backgroundColor: "#f8f9fa", borderRadius: "16px" }}
              >
                <div className="card-body d-flex flex-column px-4 py-3">
                  <h5 className="fw-bold text-primary mb-2">{p.title}</h5>
                  <p className="text-muted" style={{ flex: "1 0 auto", minHeight: "80px" }}>
                    {readMore(p.description)}
                  </p>

                  <div className="mb-2">
                    <span className="badge rounded-pill bg-warning text-dark me-2">
                      🔥 Presupuesto: ${p.budget}
                    </span>
                    <span className="badge rounded-pill bg-primary text-light">
                      📌 Estado: {p.status}
                    </span>
                  </div>


                  {p.skills?.length > 0 && (
                    <>
                      <p className="text-dark fw-bold mt-2 mb-1">
                        Habilidades requeridas:
                      </p>
                      <div className="d-flex flex-wrap mb-5">
                        {p.skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="badge bg-dark text-light me-2 mb-1"
                            style={{ fontSize: "0.8rem" }}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  <button
                    className="btn btn-info btn-sm w-100 mt-auto"
                    
                    onClick={() => navigate(`/project/${p.id}`)}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted text-center mt-5">
                  No se encontraron proyectos con esta skill.
                </div>
        )}
              </div>
            </div>
          );
};

        export default SearchResults;

