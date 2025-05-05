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

    const readMore = (id) => {
        const bio = freelancerProfiles[id]?.bio ? freelancerProfiles[id].bio : "No Bio"
        if (bio.length > 150) return bio.slice(0, 150) + "..."
    }

    return (
        <div className='container-fluid d-flex justify-content-center mt-5'>
            {store.user ? (
                <div>
                    {store.user.filter(user => user.role === "freelancer").map(user => (
                        <div key={user.id}>
                            <div className="card mb-3 freelancer-card" style={{ width: '100%' }}>
                                <div className="ms-3 row no-gutters">
                                    <div className="d-flex col-md-3 justify-content-center align-items-center">
                                        <img src={freelancerProfiles[user.id]?.profile_picture ? freelancerProfiles[user.id].profile_picture : "/User_Undefined.jpg"} alt="Foto de perfil" style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }} />

                                    </div>

                                    <div className="col-md-9">
                                        <div className="card-body">
                                            <h4 className="card-title">{user.first_name} {user.last_name}</h4>
                                            <h6 className="text-dark">{freelancerProfiles[user.id]?.career}</h6>
                                            <p className="card-text">{readMore(user.id)}</p>

                                        </div>
                                        <ul className="list-group list-group-flush me-5">
                                            <li className="list-group-item"><strong>Ubicación:</strong> {freelancerProfiles[user.id]?.location || "No especificada"} </li>
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
                                            <button className="btn btn-info me-3" onClick={() => goToProfile(user.id)}>Ver perfil</button>
                                            <a href="#" className="card-link me-3">Mensaje</a>
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
