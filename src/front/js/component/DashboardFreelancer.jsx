import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import undefined from "./../../../front/img/User_Undefined.jpg"
import styles from "./../../styles/index.css"

const DashboardFreelancer = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [freelancerProfiles, setFreelancerProfiles] = useState({});

    useEffect(() => {
        const loadData = async () => {
            await actions.getUsers();


            const freelancers = store.user?.filter(user => user.role === "freelancer") || [];

            const profiles = {};
            for (const user of freelancers) {
                const res = await actions.getFreelancerProfile(user.id);
                if (res.success) {
                    profiles[user.id] = res.profile;
                }
            }

            setFreelancerProfiles(profiles);
        };

        loadData();
    }, []);

    const goToProfile = (id) => {
        navigate(`/Profile/${id}`);
    };

    return (
        <div className='container-fluid d-flex justify-content-center mt-5'>
            {store.user ? (
                <div>
                    {store.user.filter(user => user.role === "freelancer").map(user => (
                        <div key={user.id}>
                            <div className="card mb-3 freelancer-card" style={{ width: '800px' }}>
                                <div className="ms-3 row no-gutters">
                                    <div className="d-flex col-md-4 justify-content-center align-items-center">
                                        <img src={freelancerProfiles[user.id]?.profile_picture ? freelancerProfiles[user.id].profile_picture : "/User_Undefined.jpg"} alt="Foto de perfil" style={{ width: "250px", height: "250px", borderRadius: "50%", objectFit: "cover" }} />

                                    </div>

                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{user.first_name} {user.last_name}</h5>
                                            <p className="card-text">{freelancerProfiles[user.id]?.bio ? freelancerProfiles[user.id].bio : "No Bio"}</p>
                                            <button className="btn btn-info" onClick={() => goToProfile(user.id)}>Ver perfil</button>
                                        </div>
                                        <ul className="list-group list-group-flush me-5">
                                            <li className="list-group-item"><strong>Ubicación:</strong> Madrid, España</li>
                                            <li className="list-group-item"><strong>Skills:</strong> {freelancerProfiles[user.id]?.skills?.length > 0 ? (
                                                freelancerProfiles[user.id].skills.map((skill, index) => (
                                                    <span key={index} className="badge bg-secondary me-1">{skill.name}</span>
                                                ))
                                            ) : (
                                                "No Skills"
                                            )}</li>
                                            <li className="list-group-item"><strong>Rating:</strong> {freelancerProfiles[user.id]?.rating ? `⭐ ${freelancerProfiles[user.id].rating}` : "No Rating"}</li>
                                        </ul>
                                        <div className="card-body">
                                            <a href="#" className="card-link">Mensaje</a>
                                            <a href="#" className="card-link">Conectar</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No se encontraron perfiles</div>
            )}
        </div>
    );
};

export default DashboardFreelancer;
