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
			projects: [],


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

						console.log("✅ Después de login:");
						console.log("user_id:", localStorage.getItem("user_id"));
						console.log("token:", localStorage.getItem("token"));
						console.log("role:", localStorage.getItem("role"));

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


			register: async (email, password, role, firstName, lastName) => {
				try {
					const res = await fetch(`${BASE_URL}/register`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							email,
							password,
							role,
							first_name: firstName,
							last_name: lastName
						}),
					});

					const data = await res.json();

					if (res.ok) {
						localStorage.setItem("token", data.access_token);
						localStorage.setItem("role", data.role);
						localStorage.setItem("user_id", data.user_id);

						// Actualiza el store
						setStore({
							token: data.access_token,
							email: data.email,
							role: data.role,
							userId: data.user_id,
							isAuthenticated: false,
						});
						

						return { success: true };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					return { success: false, error: "Error de conexión al servidor" };
				}
			},

			logout: () => {

				localStorage.removeItem("token");
				localStorage.removeItem("role");

				setStore({
					token: null,
					email: null,
					role: null,
					isAuthenticated: false
				});
			},

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

			getEmployerProfile: async (userId) => {
				try {
					const res = await fetch(`${BASE_URL}/employer/profile?user_id=${userId}`);
					const data = await res.json();

					if (res.ok) {
						return { success: true, profile: data };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					return { success: false, error: "Error al obtener perfil de employer" };
				}
			},

			createProject: async (formData) => {
				const token = localStorage.getItem("token");

				try {
					const res = await fetch(`${BASE_URL}/projects`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify({
							title: formData.title,
							description: formData.description,
							budget: formData.budget,
							category: formData.category,
							deadline: formData.deadline
						})
					});

					const data = await res.json();

					if (res.ok) {
						return { success: true, project: data };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					console.error("Error real:", error);
					return { success: false, error: "Error de conexión al servidor" };
				}
			},

			createProposal: async (proposalData) => {
				const token = localStorage.getItem("token");

				try {
					const res = await fetch(`${BASE_URL}/projects/${proposalData.project_id}/proposals`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify({
							freelancer_id: proposalData.freelancer_id,
							message: proposalData.message,
							proposed_budget: proposalData.proposed_budget
						})
					});

					const data = await res.json();

					if (res.ok) {
						return { success: true, proposal: data };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					console.error("Error real:", error);
					return { success: false, error: "Error de conexión al servidor" };
				}
			},


			getEmployerProposals: async (employerId) => {
				const token = localStorage.getItem("token");

				try {
					const res = await fetch(`${BASE_URL}/employer/${employerId}/proposals`, {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + token
						}
					});

					const data = await res.json();

					if (res.ok) {
						return { success: true, proposals: data };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					console.error("Error al ver Solicitudes:", error);
					return { success: false, error: "Error de conexión al servidor" };
				}
			},

			createOrUpdateProfile: async (userId, formData) => {
				try {

					const res = await fetch(`${BASE_URL}/freelancer/profile?user_id=${userId}`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							user_id: userId,
							bio: formData.bio,
							profile_picture: formData.profile_picture,
							hourly_rate: formData.hourly_rate,
							career: formData.career,
							language: formData.language,
							location: formData.location,
							education: formData.education
						}),
					});

					if (res.ok) {
						const data = await res.json();
						console.log("Perfil actualizado:", data);
						return { success: true, profile: data };
					} else if (res.status === 404) {
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
								career: formData.career,
								language: formData.language,
								location: formData.location,
								education: formData.education
							}),
						});

						const createData = await createRes.json();
						if (createRes.ok) {
							console.log("Perfil creado:", createData);
							return { success: true, profile: createData };
						} else {
							return { success: false, error: createData.msg };
						}
					} else {
						const errorData = await res.json();
						return { success: false, error: errorData.msg };
					}
				} catch (error) {
					console.error("Error en 	createOrUpdateProfile::", error);
					return { success: false, error: "Error de red" };
				}
			},

			createOrUpdateEmployerProfile: async (userId, formData) => {
				try {
					const res = await fetch(`${BASE_URL}/employer/profile`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							user_id: userId,
							bio: formData.bio,
							profile_picture: formData.profile_picture,
						}),
					});

					if (res.ok) {
						const data = await res.json();
						return { success: true, profile: data };
					} else if (res.status === 404) {
						const createRes = await fetch(`${BASE_URL}/employer/profile`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								user_id: userId,
								bio: formData.bio,
								profile_picture: formData.profile_picture,
							}),
						});

						const createData = await createRes.json();
						if (createRes.ok) {
							return { success: true, profile: createData };
						} else {
							return { success: false, error: createData.msg };
						}
					} else {
						const errorData = await res.json();
						return { success: false, error: errorData.msg };
					}
				} catch (error) {
					return { success: false, error: "Error de red" };
				}
			},

			uploadEmployerPicture: async (userId, pictureUrl) => {
				try {
					const res = await fetch(`${BASE_URL}/employer/profile/picture`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ user_id: userId, profile_picture: pictureUrl })
					});

					if (res.ok) {
						const data = await res.json();
						localStorage.setItem("profile_picture", pictureUrl);
						return { success: true, picture: pictureUrl };
					} else {
						return { success: false, error: "No se pudo actualizar la imagen" };
					}
				} catch (err) {
					console.error(err);
					return { success: false, error: "Error de conexión" };
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
					const res = await fetch(`${BASE_URL}/freelancer/profile?user_id=${userId}`);
					const data = await res.json();

					if (!res.ok || !data.skills) {
						return { success: false, error: "No se pudieron obtener las skills actuales." };
					}

					// Usamos Promise.all para esperar todos los DELETEs
					const deleteRequests = data.skills.map(fs => {
						const skillId = fs.id || fs.skill?.id;
						if (skillId) {
							return fetch(`${BASE_URL}/freelancer/skills/${skillId}?user_id=${userId}`, {
								method: "DELETE"
							});
						}
						return null;
					}).filter(Boolean); // Filtra los null

					await Promise.all(deleteRequests);

					return { success: true };
				} catch (error) {
					return { success: false, error: "Error al limpiar skills." };
				}
			},


			getUsers: async () => {
				try {
					const res = await fetch(`${BASE_URL}/admin/users`)
					const data = await res.json();
					setStore({ user: data });
				} catch (error) {
					console.error(error)
				}
			},


			getProjects: async () => {
				try {
					const res = await fetch(`${BASE_URL}/projects`)
					const data = await res.json();
					setStore({ projects: data });
				} catch (error) {
					console.error(error)
				}
			},









		}
	};
};

export default getState;
