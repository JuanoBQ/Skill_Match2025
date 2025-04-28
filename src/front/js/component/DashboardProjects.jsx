import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';

const DashboardProjects = () => {
    const { store, actions } = useContext(Context);

useEffect(()=>{
    actions.getProjects();
},[])

return(
 <div className='container-fluid d-flex justify-content-center mt-5'>
    {store.projects ? (<div> 
        {store.projects.map((project) => (
            
        <div key={project.id}>
            <div className="card mb-3" style={{ width: '800px' }}>
                <div className="ms-3 row no-gutters">
                
                    
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">{project.title}</h5>
                                <p class="card-text"><small class="text-muted">{project.category}</small></p>
                                <p class="card-text">{project.description}</p>
                                <p class="card-text"><small class="text-muted">Publicado: {project.created_at}</small></p>
                                <p class="card-text"><small class="text-muted">Status: {project.status}</small></p>
                                <a href="#" class="btn btn-info">Ver Oferta</a>
                            </div>
                        </div>
                    
                </div>
            </div>
        
        </div>
    ))}
    </div>) : (<div>No se encontraron ofertas</div>)}
 </div>
);

};

export default DashboardProjects