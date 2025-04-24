
const BASE_URL = "https://ominous-robot-7v9vgj954g5phr7jw-3001.app.github.dev/api";
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			//  Guardamos el token si existe en localStorage (para mantener la sesión al recargar)
			token: localStorage.getItem("token") || null,
			//  Guardamos el email del usuario logueado (puede servir para mostrarlo en el UI)
			email: null,
			//  Bandera para saber si el usuario está autenticado
			isAuthenticated: !!localStorage.getItem("token"), // true si hay token
			
		},
		actions: {
			login: async (email, password) => {
				try {
				  // Hacemos un POST a la API /login con email y password
				  const res = await fetch(`${BASE_URL}/login`, {
					method: "POST",
					headers: {
					  "Content-Type": "application/json", // Indicamos que el cuerpo es JSON
					},
					body: JSON.stringify({ email, password }), // Convertimos los datos a JSON
				  });
		
				  // Convertimos la respuesta en JSON
				  const data = await res.json();
		
				  // Si la respuesta fue exitosa (status 200)
				  if (res.ok) {
					// Guardamos el token en localStorage
					localStorage.setItem("token", data.access_token);
		
					// Actualizamos el estado global
					setStore({
					  token: data.access_token,
					  email: data.email,
					  isAuthenticated: true,
					});
		
					// Devolvemos éxito al componente que llamó la acción
					return { success: true };
				  } else {
					// Si hubo un error, devolvemos el mensaje del backend
					return { success: false, error: data.msg };
				  }
				} catch (error) {
				  // Si hubo un error de red o conexión, lo manejamos aquí
				  return { success: false, error: "Error de conexión al servidor" };
				}
			  },
			  register: async (email, password, role ) => {
				try {
				  // Hacemos un POST a la API /register con email, password y rol
				  const res = await fetch(`${BASE_URL}/register`, {
					method: "POST",
					headers: {
					  "Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password, role }), // Enviamos los datos como JSON
				  });
		
				  // Convertimos la respuesta en JSON
				  const data = await res.json();
		
				  // Si el registro fue exitoso
				  if (res.ok) {
					// Guardamos el token en localStorage
					localStorage.setItem("token", data.access_token);
		
					// Actualizamos el estado global
					setStore({
					  token: data.access_token,
					  email: data.email,
					  isAuthenticated: true,
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
		
			  


			
		}
	};
};

export default getState;
