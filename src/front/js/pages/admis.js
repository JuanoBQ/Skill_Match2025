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
    if (loading || !Array.isArray(store.users) || !Array.isArray(store.projects)) {
    return <div>Loading...</div>;
}




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

    // const currentUser = store.users?.find(u => u.id === store.userId);
    const currentUser = store.users.find(u => String(u.id) === String(store.userId));


    const adminName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "Admin";

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container-fluid d-flex justify-content-center">
            <div className="row border mt-5 mb-4 p-4 py-0" style={{ width: "85rem" }}>
                {/* Perfil Admin */}
                <div className="col-7 pe-0">
                    <div className="text-center" style={{ marginRight: "4rem" }}>
                        <h5 className="mt-3 mb-0">Bienvenido,  {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "Admin"}</h5>
                        <p className="opacity-75" style={{ fontSize: "0.9rem" }}>Tu panel de administrador personal</p>
                    </div>

                    <div className="container-fluid row">
                        <div className="card text-bg-secondary mb-3 me-4 col-5" style={{ maxWidth: "16.5rem", maxHeight: "21.3rem" }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <p className="card-text fs-4 ms-1 mt-1 mb-4">Perfil</p>
                                    <i className="fa-solid fa-gear fa-xl me-2" style={{ marginTop: "1.4rem" }}></i>
                                </div>
                                <div className="d-flex justify-content-center mt-5">
                                    <i className="fa-solid fa-circle-user fa-2xl mt-4" style={{ fontSize: "5rem" }}></i>
                                </div>
                                <p className="text-center mt-5 me-1 mb-0 fs-5">{adminName}</p>
                                <p className="text-center opacity-50" style={{ fontSize: "0.9rem" }}>Administrador</p>
                            </div>
                        </div>

                        {/* Contadores */}
                        <ul className="ms-2 col-7 row nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li className="card text-bg-secondary mb-3 col-5 ms-4 nav-item" role="presentation" style={{ marginRight: "0.8rem", height: "12.1rem" }}>
                                <div className="card-body p-0 ps-1 pt-2 mt-1 ms-1">
                                    <div className="d-flex">
                                        <p className="card-text fs-1 ms-1 mb-0">{store.projects.length}</p>
                                        <p className="card-text ms-1 mt-4">Trabajos</p>
                                    </div>
                                </div>
                                <button className="nav-link active mb-2" id="pills-projects-tab" data-bs-toggle="pill" data-bs-target="#pills-projects" type="button" role="tab" aria-controls="pills-projects" aria-selected="true">Trabajos</button>
                            </li>
                            <li className="card text-bg-secondary mb-3 col-5 ms-4 nav-item" role="presentation" style={{ height: "12.1rem" }}>
                                <div className="card-body p-0 ps-1 pt-2 mt-1 ms-1">
                                    <div className="d-flex">
                                        <p className="card-text fs-1 ms-1 mb-0">{store.users.length}</p>
                                        <p className="card-text ms-1 mt-4">Usuarios</p>
                                    </div>
                                </div>
                                <button className="nav-link mb-2" id="pills-users-tab" data-bs-toggle="pill" data-bs-target="#pills-users" type="button" role="tab" aria-controls="pills-users" aria-selected="false">Usuarios</button>
                            </li>
                            <li className="card text-bg-secondary mb-3 col-11 ms-4 mt-1 nav-item" role="presentation" style={{ width: "23.1rem" }}>
                                <div className="card-body p-0 ps-1 mt-1 ms-1">
                                    <p className="card-text fs-4 ms-1 mt-3 mb-4">Historial de Pagos</p>
                                </div>
                                <button className="nav-link mb-1" id="pills-pay-tab" data-bs-toggle="pill" data-bs-target="#pills-pay" type="button" role="tab" aria-controls="pills-pay" aria-selected="false">Historial</button>
                            </li>
                        </ul>
                    </div>

                    {/* Texto informativo */}
                    <div className="mt-4">
                        <div className="card text-bg-secondary mb-5 mt-3" style={{ marginLeft: "0.7rem", marginRight: "3.3rem", height: "20rem", maxWidth: "45rem" }}>
                            <div className="card-body">
                                <h5 className="card-title">Resumen</h5>
                                <p className="card-text">Administra tus proyectos y usuarios desde el panel derecho. Puedes eliminar entradas según sea necesario.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel Secundario */}
                <div className="col-5 border-start overflow-auto" style={{ height: "52.9rem" }}>
                    <div className="text-center" style={{ marginLeft: "2rem" }}>
                        <h5 className="mt-4 mb-0">Menú Secundario</h5>
                    </div>

                    <div className="tab-content" id="pills-tabContent" style={{ marginTop: "1.8rem" }}>
                        <div className="tab-pane fade show active" id="pills-projects" role="tabpanel" aria-labelledby="pills-projects-tab" tabIndex="0" style={{ marginLeft: "2.3rem" }}>
                            {store.projects.length > 0 ? (
                                list.map(project => (
                                    <div key={project.id} className="row">
                                        <div className="card text-bg-secondary ms-3 mb-4 col-9">
                                            <div className="card-body">
                                                <h5 className="card-title mb-0">{project.title}</h5>
                                                <p className="card-text">{project.category}</p>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-outline-danger mb-4 col-2" onClick={() => handleDelete(project.id)}>
                                            <i className="fa-solid fa-trash fa-2xl"></i>
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
                                <div className="card text-bg-secondary ms-3 mb-4 col-9" style={{ width: "29rem" }}>
                                    <div className="card-body">
                                        <h5 className="card-title">Factura 1</h5>
                                        <p className="card-text">Ejemplo de historial de pagos. Pronto se agregará funcionalidad real.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
