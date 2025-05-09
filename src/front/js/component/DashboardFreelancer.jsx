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
        return bio.length > 500 ? bio.slice(0, 500) + "..." : bio;
    };

    const filteredProfiles = freelancerProfiles.filter(profile =>
        (!store.filters.skills || profile.skills?.some(skill => skill.name === store.filters.skills)) &&
        (!store.filters.category || profile.career === store.filters.category) &&
        (!store.filters.rating || profile.rating >= parseInt(store.filters.rating)) &&
        (!store.filters.location || profile.location === store.filters.location) &&
        (!store.filters.hourlyRate || profile.hourly_rate <= parseFloat(store.filters.hourlyRate))
    );

    return (
        <div className='container-fluid d-flex justify-content-center mt-5'>
            {filteredProfiles.length > 0 ? (
                <div>
                    {filteredProfiles.map((profile) => (
                        <div key={profile.user.id}>
                            <div className="card mb-4 freelancer-card shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                                <div className="row no-gutters">
                                    
                                    <div className="col-md-2 d-flex justify-content-center align-items-center p-3">
                                        <img
                                            src={profile.profile_picture || undefinedImg}
                                            alt="Foto de perfil"
                                            className="rounded-circle img-fluid border border-3 border-primary"
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                    </div>

                                    
                                    <div className="col-md-10">
                                        <div className="card-body p-4">
                                            
                                            <h4 className="text-dark fs-5 fw-bold mb-2">{profile.user.first_name} {profile.user.last_name}</h4>
                                            <h5 className="text-muted mb-3">{profile.career}</h5>

                                           
                                            <p className="card-text text-muted mb-3" style={{ height: '70px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {readMore(profile.bio)}
                                            </p>

                                           
                                            <div className="d-flex justify-content-between align-items-center">
                                                <button
                                                    className="btn btn-outline-primary px-4 py-2"
                                                    onClick={() => goToProfile(profile.user.id)}
                                                    style={{ fontWeight: '500' }}
                                                >
                                                    Ver perfil
                                                </button>
                                                <div className="text-muted d-flex gap-3">
                                                    <a href="#" className="card-link text-decoration-none">Mensaje</a>
                                                    <a href="#" className="card-link text-decoration-none">Conectar</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="card-body p-4 bg-light">
                                    
                                    <div className="d-flex justify-content-between align-items-center mb-3" style={{ fontSize: '0.9rem' }}>
                                        <strong>Ubicación:</strong>
                                        <span className="text-muted" style={{ fontWeight: '400' }}>{profile.location || "No especificada"}</span>
                                    </div>

                                    <div className="gap-2 mb-3" style={{ fontSize: '0.9rem' }}>
                                        <strong>Skills:</strong>
                                        {profile.skills?.length > 0 ? (
                                            profile.skills.map((skill, index) => (
                                                <span key={index} className="badge bg-dark ms-2 rounded-pill">{skill.name}</span>
                                            ))
                                        ) : (
                                            <span className="text-muted">No Skills</span>
                                        )}
                                    </div>

                                   
                                    <div className="d-flex justify-content-between align-items-center mb-3" style={{ fontSize: '0.9rem' }}>
                                        <strong>Rating:</strong>
                                        <span className="text-muted" style={{ fontWeight: '400' }}>{profile.rating ? `⭐ ${profile.rating}` : "No Rating"}</span>
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
