import React, { useState, useEffect, useContext } from "react";
import { Context } from '../store/appContext';

const MyUsersList = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        actions.getUsers()
            .then(() => {
                setLoading(false);  // Set loading to false after users are fetched
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setLoading(false);  // Handle errors
            });
    }, [actions]);

    // Ensure store.users is always an array before filtering
    const userList = Array.isArray(store.users) ? store.users.filter(user => 
        (!store.filters || !store.filters.first_name || user.first_name === store.filters.first_name) &&
        (!store.filters || !store.filters.last_name || user.last_name === store.filters.last_name) &&
        (!store.filters || !store.filters.email || user.email === store.filters.email)
    ) : [];

    // Conditional rendering based on loading state
    if (loading) {
        return <div>Loading...</div>;  // Show loading message until data is fetched
    }

    return (
        <div>
            {store.users && store.users.length > 0 ? (
                <div>
                    {userList.map((user) => (
                        <div key={user.id}>
                            <div className="d-flex">
                                <div className="card text-bg-secondary mb-4 col-10" style={{ width: "" }}>
                                    <div className="card-body">
                                        <h5 className="card-title mb-0">{user.first_name} {user.last_name}</h5>
                                        <p className="card-text">{user.email}</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-column ms-3">
                                    <button type="button" className="btn btn-outline-danger pt-2" style={{ height: "2.3rem", marginBottom: "0.5rem" }}><i className="fa-solid fa-flag fa-lg"></i></button>
                                    <button type="button" className="btn btn-outline-danger" style={{ height: "2.3rem" }}><i className="fa-solid fa-trash fa-lg"></i></button>
                                </div>
                            </div>
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