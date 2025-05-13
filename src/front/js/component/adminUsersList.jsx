import React, { useState, useEffect, useContext } from "react";
import { Context } from '../store/appContext';

const MyUsersList = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                await actions.getUsers();
                await actions.getProjects();
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm("¿Estás seguro de eliminar este usuario?");
        if (!confirmed) return;

        const result = await actions.deleteUser(userId);
        if (!result.success) {
            alert("Error eliminando usuario: " + result.error);
        } else {
            await actions.getUsers();
            await actions.getProjects();
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case "freelancer":
                return "badge bg-primary";
            case "employer":
                return "badge bg-success";
            case "admin":
                return "badge bg-secondary";
            default:
                return "badge bg-light text-dark";
        }
    };

    const userList = Array.isArray(store.users)
        ? store.users.filter(user =>
            (!store.filters || !store.filters.first_name || user.first_name === store.filters.first_name) &&
            (!store.filters || !store.filters.last_name || user.last_name === store.filters.last_name) &&
            (!store.filters || !store.filters.email || user.email === store.filters.email)
        )
        : [];

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {userList.length > 0 ? (
                <div>
                    {userList.map((user) => (
                        <div key={user.id} className="d-flex align-items-center mb-3">
                            <div className="card col-10 px-3 py-2" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-0">{user.first_name} {user.last_name}</h6>
                                        <small className="text-muted">{user.email}</small><br />
                                        <span className={`${getRoleBadgeClass(user.role)} mt-1`}>{user.role}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-outline-danger ms-2"
                                style={{ height: "2.5rem" }}
                                onClick={() => handleDeleteUser(user.id)}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No se encontraron usuarios</div>
            )}
        </div>
    );
};

export default MyUsersList;
