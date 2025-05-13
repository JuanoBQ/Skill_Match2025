import React, { useState, useEffect, useContext } from "react";
import { Context } from '../store/appContext';
import MyUsersList from "../component/adminUsersList.jsx";

export const Admin = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await actions.getUsers();
            await actions.getProjects();
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleDelete = async (projectId) => {
        const response = await actions.deleteProject(projectId);
        if (response.success) {
            actions.getProjects();
        } else {
            alert(`Error: ${response.error}`);
        }
    };

    const list = store.projects.filter(project =>
        (!store.filters || !store.filters.title || project.title === store.filters.title) &&
        (!store.filters || !store.filters.category || project.category === store.filters.category)
    );

    const currentUser = store.users.find(u => String(u.id) === String(store.userId));
    const adminName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "Admin";

    if (loading || !Array.isArray(store.users) || !Array.isArray(store.projects)) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid d-flex justify-content-center">
            <div className="row border mt-5 mb-4 p-4 py-0 rounded-4 shadow" style={{ width: "85rem", backgroundColor: "#f8f9fa" }}>
                <div className="col-7 pe-0">
                    <div className="text-center mb-4" style={{ marginRight: "4rem" }}>
                        <h4 className="fw-semibold">Bienvenido, {adminName}</h4>
                        <p className="opacity-75" style={{ fontSize: "0.9rem" }}>Gestiona tu plataforma desde este panel administrativo</p>
                    </div>

                    <div className="container-fluid row">
                        <div className="card bg-light border-0 shadow-sm mb-3 me-4 col-5" style={{ maxWidth: "16.5rem" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="fw-bold">Perfil</h6>
                                    <i className="fa-solid fa-gear"></i>
                                </div>
                                <div className="text-center mt-3">
                                    <i className="fa-solid fa-circle-user fa-3x"></i>
                                    <p className="mt-3 mb-0 fw-semibold">{adminName}</p>
                                    <span className="badge bg-secondary">Administrador</span>
                                </div>
                            </div>
                        </div>

                        <ul className="ms-2 col-7 row nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li className="card bg-white border-0 shadow-sm mb-3 col-5 ms-4 nav-item text-center p-3" role="presentation">
                                <h3 className="mb-0 text-primary">{store.projects.length}</h3>
                                <p className="mb-1">Trabajos</p>
                                <button className="nav-link active btn btn-outline-primary" id="pills-projects-tab" data-bs-toggle="pill" data-bs-target="#pills-projects" type="button" role="tab">Ver</button>
                            </li>
                            <li className="card bg-white border-0 shadow-sm mb-3 col-5 ms-4 nav-item text-center p-3" role="presentation">
                                <h3 className="mb-0 text-success">{store.users.length}</h3>
                                <p className="mb-1">Usuarios</p>
                                <button className="nav-link btn btn-outline-success" id="pills-users-tab" data-bs-toggle="pill" data-bs-target="#pills-users" type="button" role="tab">Ver</button>
                            </li>
                            <li className="card bg-white border-0 shadow-sm mb-3 col-11 ms-4 mt-1 nav-item text-center p-3" role="presentation">
                                <h6 className="fw-semibold">Historial de Pagos</h6>
                                <button className="nav-link btn btn-outline-dark" id="pills-pay-tab" data-bs-toggle="pill" data-bs-target="#pills-pay" type="button" role="tab">Historial</button>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-4">
                        <div className="card bg-white shadow-sm mb-5 mt-3 px-3 py-4" style={{ marginLeft: "0.7rem", marginRight: "3.3rem", maxWidth: "45rem" }}>
                            <h5 className="card-title">Resumen del Panel</h5>
                            <p className="card-text">Este panel te permite tener una vista general de toda la actividad en la plataforma. Desde aquí puedes revisar proyectos activos, gestionar usuarios registrados, revisar historial de pagos y mantener el sistema en orden. Usa las pestañas del menú secundario para ver los detalles y eliminar registros si es necesario.</p>
                        </div>
                    </div>
                </div>

                <div className="col-5 border-start overflow-auto" style={{ height: "52.9rem" }}>
                    <div className="text-center mb-3" style={{ marginLeft: "2rem" }}>
                        <h5 className="mt-4 mb-0">Menú Secundario</h5>
                    </div>

                    <div className="tab-content" id="pills-tabContent" style={{ marginTop: "1.8rem" }}>
                        <div className="tab-pane fade show active" id="pills-projects" role="tabpanel" aria-labelledby="pills-projects-tab" tabIndex="0" style={{ marginLeft: "2.3rem" }}>
                            {store.projects.length > 0 ? (
                                list.map(project => (
                                    <div key={project.id} className="row align-items-center">
                                        <div className="card bg-light shadow-sm ms-3 mb-3 col-9 py-2 px-3">
                                            <h6 className="fw-bold mb-1">{project.title}</h6>
                                            <span className="badge bg-secondary">{project.category}</span>
                                        </div>
                                        <button type="button" className="btn btn-outline-danger mb-3 col-2" onClick={() => handleDelete(project.id)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div>No se encontraron trabajos</div>
                            )}
                        </div>

                        <div className="tab-pane fade" id="pills-users" role="tabpanel" aria-labelledby="pills-users-tab" tabIndex="0" style={{ marginLeft: "2.5rem" }}>
                            <MyUsersList />
                        </div>

                        <div className="tab-pane fade" id="pills-pay" role="tabpanel" aria-labelledby="pills-pay-tab" tabIndex="0">
                            <div className="row d-flex justify-content-center">
                                <div className="card bg-light shadow-sm ms-3 mb-4 col-9 p-3">
                                    <h6 className="fw-bold">Factura 1</h6>
                                    <p className="mb-0">Ejemplo de historial de pagos. Pronto se agregará funcionalidad real.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

