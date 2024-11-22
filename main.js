const API_URL = 'http://localhost:5001'; // Cambia a la URL de tu backend si está desplegado

// Mostrar/Ocultar secciones
document.getElementById('register-link').addEventListener('click', () => toggleSections('register'));
document.getElementById('login-link').addEventListener('click', () => toggleSections('login'));
document.getElementById('create-challenge-link').addEventListener('click', () => toggleSections('createChallenge'));
document.getElementById('participate-challenge-link').addEventListener('click', () => {
    toggleSections('participateChallenge');
    fetchChallenges(); // Llenar el select para participar
});
document.getElementById('update-challenge-link').addEventListener('click', () => {
    toggleSections('updateChallenge');
    fetchChallenges(); // Llenar el select para actualizar
});
document.getElementById('delete-challenge-link').addEventListener('click', () => {
    toggleSections('deleteChallenge');
    displayChallengesForDelete(); // Mostrar retos para eliminar
});
document.getElementById('view-challenges-link').addEventListener('click', () => {
    toggleSections('viewChallenges');
    displayAllChallenges(); // Mostrar todos los retos
});
document.getElementById('update-stats-link').addEventListener('click', () => toggleSections('updateStats'));
document.getElementById('view-stats-link').addEventListener('click', () => {
    toggleSections('viewStats');
    fetchAllStats(); // Cargar estadísticas al acceder
});

function toggleSections(section) {
    const sections = {
        register: 'register-section',
        login: 'login-section',
        createChallenge: 'create-challenge-section',
        participateChallenge: 'participate-challenge-section',
        updateChallenge: 'update-challenge-section',
        deleteChallenge: 'delete-challenge-section',
        viewChallenges: 'view-challenges-section',
        updateStats: 'update-stats-section',
        viewStats: 'view-stats-section',
    };

    for (const key in sections) {
        document.getElementById(sections[key]).style.display = key === section ? 'block' : 'none';
    }
}

// Registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('emailRegister').value;
    const password = document.getElementById('passwordRegister').value;
    const rol = document.getElementById('rolRegister').value;

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password, rol }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Registro exitoso.');
            toggleSections('login');
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al registrar:', error);
    }
});

// Inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            alert('Inicio de sesión exitoso.');
            toggleSections('createChallenge');
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
});

// **Actualizar Usuario**
document.getElementById('updateUserForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = document.getElementById('userIdToUpdate').value;
    const nombre = document.getElementById('updateUserName').value;
    const email = document.getElementById('updateUserEmail').value;
    const password = document.getElementById('updateUserPassword').value;
    const rol = document.getElementById('updateUserRole').value;

    const data = { nombre, email, password, rol };

    // Filtrar campos vacíos
    Object.keys(data).forEach(key => {
        if (!data[key]) delete data[key];
    });

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/usuarios/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Usuario actualizado exitosamente.');
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
    }
});

// **Eliminar Usuario**
document.getElementById('deleteUserForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = document.getElementById('userIdToDelete').value;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/usuarios/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const result = await response.json();
        if (response.ok) {
            alert('Usuario eliminado exitosamente.');
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
});

// Crear Reto
document.getElementById('createChallengeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('challengeName').value;
    const descripcion = document.getElementById('challengeDescription').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/api/retos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ titulo, descripcion }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Reto creado exitosamente.');
            fetchChallenges(); // Actualizar los retos
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al crear el reto:', error);
    }
});

// Participar en Reto
document.getElementById('participateChallengeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const retoId = document.getElementById('retoId').value;
    const imagenUrl = document.getElementById('imagenUrl').value;
    const descripcion = document.getElementById('descripcion').value;
    const token = localStorage.getItem('token');

    const data = { retoId, imagenUrl, descripcion };

    try {
        const response = await fetch(`${API_URL}/api/publicaciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Participación en el reto enviada exitosamente.');
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al participar en el reto:', error);
    }
});

// Actualizar Reto
document.getElementById('updateChallengeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const retoId = document.getElementById('updateRetoId').value;
    const titulo = document.getElementById('updateChallengeName').value;
    const descripcion = document.getElementById('updateChallengeDescription').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/api/retos/${retoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ titulo, descripcion }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Reto actualizado exitosamente.');
            fetchChallenges(); // Actualizar los retos
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al actualizar el reto:', error);
    }
});

// Eliminar Reto
async function deleteChallenge(retoId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/api/retos/${retoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const result = await response.json();
        if (response.ok) {
            alert('Reto eliminado correctamente.');
            displayChallengesForDelete(); // Refrescar la lista
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al eliminar el reto:', error);
    }
}

// Mostrar retos con botones para eliminar
async function displayChallengesForDelete() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/api/retos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const retos = await response.json();
        const list = document.getElementById('challengeList');
        list.innerHTML = retos.map(reto => `
            <li>
                <strong>${reto.titulo}</strong> - ${reto.descripcion}
                <button onclick="deleteChallenge('${reto._id}')">Eliminar</button>
            </li>
        `).join('');
    } catch (error) {
        console.error('Error al cargar retos para eliminar:', error);
    }
}

// Ver todos los Retos
async function displayAllChallenges() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/api/retos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const retos = await response.json();
        const container = document.getElementById('allChallenges');
        container.innerHTML = retos.map(reto => `
            <div>
                <h3>${reto.titulo}</h3>
                <p>${reto.descripcion}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar todos los retos:', error);
    }
}

// Obtener Retos para los Selects
async function fetchChallenges() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/api/retos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const retos = await response.json();
        const participateSelect = document.getElementById('retoId');
        const updateSelect = document.getElementById('updateRetoId');

        participateSelect.innerHTML = '<option value="" disabled selected>Selecciona un Reto</option>';
        updateSelect.innerHTML = '<option value="" disabled selected>Selecciona un Reto</option>';

        retos.forEach(reto => {
            const option = document.createElement('option');
            option.value = reto._id;
            option.textContent = reto.titulo;
            participateSelect.appendChild(option);

            const updateOption = option.cloneNode(true);
            updateSelect.appendChild(updateOption);
        });
    } catch (error) {
        console.error('Error al obtener retos:', error);
    }
}

// Funciones relacionadas con estadísticas
document.getElementById('updateStatsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuarioId').value;
    const likesRecibidos = parseInt(document.getElementById('likesRecibidos').value, 10);

    try {
        const response = await fetch(`${API_URL}/api/estadisticas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, likesRecibidos }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Estadísticas actualizadas exitosamente.');
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error al actualizar las estadísticas:', error);
    }
});

async function fetchAllStats() {
    try {
        const response = await fetch(`${API_URL}/api/estadisticas`, {
            method: 'GET',
        });

        const estadisticas = await response.json();
        const container = document.getElementById('statsContainer');
        container.innerHTML = estadisticas.map(est => `
            <div>
                <h3>Usuario: ${est.usuario}</h3>
                <p>Likes Recibidos: ${est.likesRecibidos}</p>
                <p>Publicaciones Creadas: ${est.publicacionesCreadas}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
    }
}
