import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const Profile = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const [user, setUser] = useState(null);

    useEffect(() => {

        if (!store.user || store.user.length === 0) {
            actions.getUsers();
        }
    }, []);

    useEffect(() => {

        if (store.user && store.user.length > 0) {
            const foundUser = store.user.find((u) => u.id === parseInt(id));
            setUser(foundUser);
        }
    }, [store.user, id]);

    if (!user) {
        return <div className="text-center mt-5">Cargando perfil...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">

                    <div className="card shadow-sm border-light">
                        <div className="card-body">
                            <div className="text-center">
                                <img
                                    src="https://i.pravatar.cc/150?img=5"
                                    alt="Foto de perfil"
                                    className="rounded-circle mb-4"
                                    width="150"
                                    height="150"
                                />
                                <h2 className="card-title mb-3">
                                    {user.first_name} {user.last_name}
                                </h2>
                                <p className="text-muted mb-3">
                                    <strong>Desarrollador web</strong>
                                </p>
                                <p className="card-text text-justify">
                                    Desarrollador web con experiencia en frontend y backend.
                                    Especializado en React, Node.js, y diseño UX/UI. Apasionado por
                                    crear experiencias digitales únicas.
                                </p>
                            </div>


                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <strong>Ubicación:</strong> Madrid, España
                                </li>
                                <li className="list-group-item">
                                    <strong>Habilidades:</strong> JavaScript, React, Node.js, HTML, CSS
                                </li>
                                <li className="list-group-item">
                                    <strong>Rating:</strong> ⭐⭐⭐⭐⭐
                                </li>
                            </ul>

                            <div className="card-body text-center">
                                <button className="btn btn-primary me-2">Mensaje</button>
                                <button className="btn btn-success">Conectar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
