const API_URL = 'http://localhost:5001'; // Cambia a la URL de tu backend si está desplegado

// Elementos iniciales
const mainButtons = document.getElementById('main-buttons');
const nav = document.querySelector('nav');

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
    const rol = "usuario"

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password, rol }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Registro exitoso.');
            localStorage.setItem('token', result.token);
            localStorage.setItem('rol', result.rol);
            localStorage.setItem('nombre', result.nombre);
            activateMenu();
            toggleSections('viewChallenges');
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
            localStorage.setItem('rol', result.rol);
            localStorage.setItem('nombre', result.nombre);
            alert('Inicio de sesión exitoso.');
            activateMenu();
            await loadChallenges();
            toggleSections('viewChallenges');
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
    const usuario = localStorage.getItem('nombre');

    const data = { retoId, imagenUrl, descripcion, usuario };

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
            fetchChallenges();
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
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
            alert('Reto eliminado correctamente.');
            // fetchChallenges(); // Refrescar lista
            displayChallengesForDelete(); // Refrescar la lista
        } else {
            const result = await response.json();
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
            <div class="challenge-card">
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
        const response = await fetch(`${API_URL}/api/estadisticas`, { method: 'GET' });
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

// Activar menú y ocultar botones iniciales
async function activateMenu() {
    const mainButtons = document.getElementById('main-buttons');
    console.log(mainButtons); // Verifica si encuentra el elemento
    console.log(mainButtons.style.display); // Contenedor de botones iniciales
    const nav = document.querySelector('nav'); // Menú de navegación

    if (mainButtons) {
        mainButtons.style.display = 'none'; // Ocultar botones iniciales
    } else {
        console.warn('main-buttons no encontrado');
    }

    if (nav) {
        nav.style.display = 'flex'; // Mostrar menú completo
        filterMenuByRole(); // Filtrar opciones del menú por rol
    } else {
        console.warn('nav no encontrado');
    }
}

// Función para mostrar/ocultar opciones del menú según el rol
function filterMenuByRole() {
    const userRole = localStorage.getItem('rol'); // Obtén el rol desde localStorage

    // Mapea IDs de botones/elementos al rol que los puede ver
    const rolePermissions = {
        usuario: ['participate-challenge-link', 'view-challenges-link', 'view-stats-link'],
        admin: [
            'participate-challenge-link',
            'view-challenges-link',
            'view-stats-link',
            'create-challenge-link',
            'update-challenge-link',
            'delete-challenge-link',
            'update-stats-link',
        ],
    };

    // Oculta todos los botones del menú
    document.querySelectorAll('nav button').forEach((button) => {
        button.style.display = 'none';
    });

    // Muestra los botones permitidos según el rol
    if (userRole && rolePermissions[userRole]) {
        rolePermissions[userRole].forEach((id) => {
            const button = document.getElementById(id);
            if (button) button.style.display = 'inline-block';
        });
    }
}

// Modificar activateMenu para incluir el filtro del menú
function activateMenu() {
    const nav = document.querySelector('nav');
    if (nav) {
        nav.style.display = 'flex'; // Muestra el menú
        filterMenuByRole(); // Filtra las opciones del menú por rol
    }
}
