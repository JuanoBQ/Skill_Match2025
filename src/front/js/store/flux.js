

const BASE_URL = "https://fictional-carnival-q74qppx4p4w63vpg-3001.app.github.dev/api";


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
			user: []
			
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

				
			  

			  
		
			  


			
		}
	};
};

export default getState;
