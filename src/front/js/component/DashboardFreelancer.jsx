import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import undefinedImg from "./../../../front/img/User_Undefined.jpg";

const DashboardFreelancer = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [freelancerProfiles, setFreelancerProfiles] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            await actions.getUsers();

            const freelancers = store.user?.filter(user => user.role === "freelancer") || [];

            const profiles = [];
            for (const user of freelancers) {
                const res = await actions.getFreelancerProfile(user.id);
                if (res.success) {
                    profiles.push(res.profile);
                }
            }

            setFreelancerProfiles(profiles);
        };

        loadData();
    }, []);

    const goToProfile = (id) => {
        navigate(`/Profile/${id}`);
    };

    const readMore = (bio) => {
        if (!bio) return "No Bio";
        return bio.length > 150 ? bio.slice(0, 150) + "..." : bio;
    };

    const filteredProfiles = freelancerProfiles.filter(profile =>
        (!store.filters.skills || profile.skills?.some(skill => skill.name === store.filters.skills)) &&
        (!store.filters.category || profile.career === store.filters.category) &&
        (!store.filters.rating || profile.rating >= parseInt(store.filters.rating)) &&
        (!store.filters.hourlyRate || profile.hourly_rate <= parseFloat(store.filters.hourlyRate))
    );

    return (
        <div className='container-fluid d-flex justify-content-center mt-5'>
            {filteredProfiles.length > 0 ? (
                <div>
                    {filteredProfiles.map((profile) => (
                        <div key={profile.user.id}>
                            <div className="card mb-3 freelancer-card" style={{ width: '100%' }}>
                                <div className="ms-3 row no-gutters">
                                    <div className="d-flex col-md-3 justify-content-center align-items-center">
                                        <img
                                            src={profile.profile_picture || undefinedImg}
                                            alt="Foto de perfil"
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                borderRadius: "50%",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </div>

                                    <div className="col-md-9">
                                        <div className="card-body">
                                            <h4 className="card-title">{profile.user.first_name} {profile.user.last_name}</h4>
                                            <h6 className="text-dark">{profile.career}</h6>
                                            <p className="card-text">{readMore(profile.bio)}</p>
                                        </div>
                                        <ul className="list-group list-group-flush me-5">
                                            <li className="list-group-item">
                                                <strong>Ubicación:</strong> {profile.location || "No especificada"}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Skills:</strong>{" "}
                                                {profile.skills?.length > 0 ? (
                                                    profile.skills.map((skill, index) => (
                                                        <span key={index} className="badge bg-secondary me-1">{skill.name}</span>
                                                    ))
                                                ) : (
                                                    "No Skills"
                                                )}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Rating:</strong> {profile.rating ? `⭐ ${profile.rating}` : "No Rating"}
                                            </li>
                                        </ul>
                                        <div className="card-body">
                                            <button className="btn btn-info me-3" onClick={() => goToProfile(profile.user.id)}>Ver perfil</button>
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
