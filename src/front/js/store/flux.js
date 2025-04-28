const BASE_URL = "https://improved-happiness-7v59ppx5pwgpfrwqr-3001.app.github.dev/api";


const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			//  Guardamos el token si existe en localStorage (para mantener la sesión al recargar)
			token: localStorage.getItem("token") || null,
			//  Guardamos el email del usuario logueado (puede servir para mostrarlo en el UI)
			email: null,
			role: localStorage.getItem("role") || null, 
			userId: localStorage.getItem("user_id") || null,
			//  Bandera para saber si el usuario está autenticado
			isAuthenticated: !!localStorage.getItem("token"), // true si hay token
			user: [],
			projects: []
			
		},
		actions: {
			login: async (email, password) => {
				try {
				  // Hacemos un POST a la API /login con email y password
				  const res = await fetch(`${BASE_URL}/login`, {
					method: "POST",
					headers: {
					  "Content-Type": "application/json", 
					},
					body: JSON.stringify({ email, password }), 
				  });
			  
				  const data = await res.json();
				  console.log("🔍 Respuesta completa del backend en login:", data);

			  
				  if (res.ok) {
					// Guardamos el token en localStorage
					localStorage.setItem("token", data.access_token);
					localStorage.setItem("role", data.role);
					localStorage.setItem("user_id", data.user_id); 
			  
					// ✅ Actualizamos el store con toda la info
					setStore({
					  token: data.access_token,
					  email: data.email,
					  role: data.role,
					  userId: data.user_id,
					  isAuthenticated: true,
					});
			  
					return { success: true };
				  } else {
					// Si hubo error de autenticación
					return { success: false, error: data.msg };
				  }
				} catch (error) {
				  // Si hubo error de red o servidor
				  return { success: false, error: "Error de conexión al servidor" };
				}
			  },
			  

			  register: async (email, password, role,firstName, lastName ) => {
				try {
				  // Hacemos un POST a la API /register con email, password y rol
				  const res = await fetch(`${BASE_URL}/register`, {
					method: "POST",
					headers: {
					  "Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password, role,first_name: firstName,last_name: lastName }), // Enviamos los datos como JSON
				  });
		
				  // Convertimos la respuesta en JSON
				  const data = await res.json();
		
				  // Si el registro fue exitoso
				  if (res.ok) {
					localStorage.removeItem("token");
                    localStorage.removeItem("role");

			
		
					// Actualizamos el estado global
					setStore({
					  token: data.access_token,
					  email: data.email,
					  isAuthenticated: false,
					});
		
					// Devolvemos éxito al componente
					return { success: true };
				  } else {
					// Si hubo un error, devolvemos el mensaje del backend
					return { success: false, error: data.msg };
				  }
				} catch (error) {
				  // Si hubo un error de red o conexión
				  return { success: false, error: "Error de conexión al servidor" };
				}
			  },
			  logout: () => {
				// Limpia los datos del usuario
				localStorage.removeItem("token");
				localStorage.removeItem("role");
			  
				setStore({
				  token: null,
				  email: null,
				  role: null,
				  isAuthenticated: false
				});
			  },
			     // --- Nuevo FETCH para traer el perfil del Freelancer ---
				getFreelancerProfile: async (userId) => {
					try {
						const res = await fetch(`${BASE_URL}/freelancer/profile?user_id=${userId}`);
						const data = await res.json();
						
						if (res.ok) {
							return { success: true, profile: data };
						} else {
							return { success: false, error: data.msg };
						}
					} catch (error) {
						return { success: false, error: "Error al obtener perfil de freelancer" };
					}
				},

				// --- Nuevo FETCH para traer la info de EMPLOYER (lo básico, por ahora el User) ---
				getEmployerProfile: async (userId) => {
					try {
						const res = await fetch(`${BASE_URL}/users/me?user_id=${userId}`);
						const data = await res.json();
						
						if (res.ok) {
							return { success: true, employer: data };
						} else {
							return { success: false, error: data.msg };
						}
					} catch (error) {
						return { success: false, error: "Error al obtener perfil de employer" };
					}
				},
				createOrUpdateProfile: async (userId, formData) => {
					try {
						
							  console.log("👉 Datos que estoy mandando:", userId, formData); // Agrega este console.log
						  
					  const res = await fetch(`${BASE_URL}/freelancer/profile`, {
						method: "PATCH", // intentamos actualizar primero
						headers: {
						  "Content-Type": "application/json",
						},
						body: JSON.stringify({
						  user_id: userId,
						  bio: formData.bio,
						  profile_picture: formData.profile_picture,
						  hourly_rate: formData.hourly_rate,
						}),
					  });
				  
					  if (res.ok) {
						const data = await res.json();
						console.log("✅ Perfil actualizado:", data);
						return { success: true, profile: data };
					  } else if (res.status === 404) {
						// Si el perfil no existe, creamos uno nuevo
						const createRes = await fetch(`${BASE_URL}/freelancer/profile`, {
						  method: "POST",
						  headers: {
							"Content-Type": "application/json",
						  },
						  body: JSON.stringify({
							user_id: userId,
							bio: formData.bio,
							profile_picture: formData.profile_picture,
							hourly_rate: formData.hourly_rate,
						  }),
						});
				  
						const createData = await createRes.json();
						if (createRes.ok) {
						  console.log("✅ Perfil creado:", createData);
						  return { success: true, profile: createData };
						} else {
						  return { success: false, error: createData.msg };
						}
					  } else {
						const errorData = await res.json();
						return { success: false, error: errorData.msg };
					  }
					} catch (error) {
					  console.error("❌ Error en 	createOrUpdateProfile::", error);
					  return { success: false, error: "Error de red" };
					}
				  },
				  getSkills: async () => {
					try {
					  const res = await fetch(`${BASE_URL}/skills`);
					  const data = await res.json();
				  
					  if (res.ok) {
						return { success: true, skills: data };
					  } else {
						return { success: false, error: data.msg };
					  }
					} catch (error) {
					  return { success: false, error: "Error al obtener skills" };
					}
				  },
				  addFreelancerSkills: async (userId, skillIds) => {
					try {
					  const res = await fetch(`${BASE_URL}/freelancer/skills`, {
						method: "POST",
						headers: {
						  "Content-Type": "application/json"
						},
						body: JSON.stringify({
						  user_id: userId,
						  skill_ids: skillIds
						})
					  });
				  
					  const data = await res.json();
				  
					  if (res.ok) {
						return { success: true };
					  } else {
						return { success: false, error: data.msg };
					  }
					} catch (error) {
					  return { success: false, error: "Error al asignar skills" };
					}
				  },
				  clearFreelancerSkills: async (userId) => {
					try {
					  // Traemos todas las skills actuales del perfil
					  const res = await fetch(`${BASE_URL}/freelancer/profile?user_id=${userId}`);
					  const data = await res.json();
				  
					  if (!res.ok || !data.skills) {
						return { success: false, error: "No se pudieron obtener las skills actuales." };
					  }
				  
					  // Borramos cada skill individualmente
					  for (const fs of data.skills) {
						const skillId = fs.skill?.id;
						if (skillId) {
						  await fetch(`${BASE_URL}/freelancer/skills/${skillId}?user_id=${userId}`, {
							method: "DELETE",
						  });
						}
					  }
				  
					  return { success: true };
					} catch (error) {
					  return { success: false, error: "Error al limpiar skills." };
					}
				  },
				  
				  getUsers: async ()=>{
					try {
						const res = await fetch(`${BASE_URL}/admin/users`)
						const data = await res.json();
						setStore({user : data});
					} catch (error) {
						console.error(error)
					}
				  },
				  
				  
				  getProjects: async ()=>{
					try {
						const res = await fetch(`${BASE_URL}/projects`)
						const data = await res.json();
						setStore({projects : data});
					} catch (error) {
						console.error(error)
					}
				  }
				
			  

			  
		
			  


			
		}
	};
};

export default getState;
