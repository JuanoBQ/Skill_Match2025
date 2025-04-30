import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

const DashboardFreelancer = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(()=>{
    actions.getUsers();
    },[])

    const goToProfile = (id) => {
        navigate(`/Profile/${id}`);
    };

return(
 <div className='container-fluid d-flex justify-content-center mt-5'>
    {store.user ? (<div> 
        {store.user.filter((user) => user.role === "freelancer").map((user) => (
            
        <div key={user.id}>
            <div className="card mb-3" style={{ width: '800px' }}>
                <div className="ms-3 row no-gutters">
                
                    <div className="d-flex col-md-4 justify-content-center align-items-center">
                    <img src="https://i.pravatar.cc/150?img=5" className="card-img" alt="Foto de perfil"/>
                    </div>

                    <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{user.first_name} {user.last_name}</h5>
                        <p className="card-text">Desarrollador web con experiencia en frontend y backend. Especializado en React, Node.js, y diseño UX/UI.</p>
                        <button className="btn btn-info" onClick={() => goToProfile(user.id)}>Ver perfil</button>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item"><strong>Ubicación:</strong> Madrid, España</li>
                        <li className="list-group-item"><strong>Habilidades:</strong> JavaScript, React, Node.js, HTML, CSS</li>
                        <li className="list-group-item"><strong>Rating:</strong> ⭐⭐⭐⭐⭐</li>
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
    </div>) : (<div>No se encontraron perfiles</div>)}
 </div>
);

};

export default DashboardFreelancer