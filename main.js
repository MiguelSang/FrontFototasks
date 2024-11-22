const API_URL = 'http://localhost:5001'; // Cambia a la URL de tu backend si está desplegado

// Mostrar/Ocultar secciones
document.getElementById('register-link').addEventListener('click', () => toggleSections('register'));
document.getElementById('login-link').addEventListener('click', () => toggleSections('login'));
document.getElementById('create-challenge-link').addEventListener('click', () => toggleSections('createChallenge'));
document.getElementById('participate-challenge-link').addEventListener('click', () => toggleSections('participateChallenge'));
document.getElementById('update-challenge-link').addEventListener('click', () => toggleSections('updateChallenge'));
document.getElementById('delete-challenge-link').addEventListener('click', () => {
    toggleSections('deleteChallenge');
    displayChallengesForDelete(); // Cargar la lista de retos al entrar
});
document.getElementById('view-challenges-link').addEventListener('click', () => {
    toggleSections('viewChallenges');
    displayAllChallenges(); // Cargar todos los retos
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

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password }),
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
            toggleSections('retos');
            fetchChallenges();
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
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
            fetchChallenges();
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
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const result = await response.json();
        if (response.ok) {
            alert('Reto eliminado correctamente.');
            fetchChallenges();
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
