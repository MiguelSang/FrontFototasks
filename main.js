const API_URL = 'http://localhost:5001'; // Cambia a la URL de tu backend si está desplegado

// Mostrar/Ocultar secciones
document.getElementById('register-link').addEventListener('click', () => toggleSections('register'));
document.getElementById('login-link').addEventListener('click', () => toggleSections('login'));
document.getElementById('create-challenge-link').addEventListener('click', () => toggleSections('createChallenge'));
document.getElementById('participate-challenge-link').addEventListener('click', () => toggleSections('participateChallenge'));

function toggleSections(section) {
    const sections = {
        register: 'register-section',
        login: 'login-section',
        createChallenge: 'create-challenge-section',
        participateChallenge: 'participate-challenge-section',
        retos: 'retos-section',
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
    const foto = document.getElementById('foto').files[0];
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('retoId', retoId);
    formData.append('foto', foto);

    try {
        const response = await fetch(`${API_URL}/api/retos/participar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            alert('Foto subida exitosamente.');
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al participar en el reto:', error);
    }
});

// Obtener Retos
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
        const container = document.getElementById('trendingChallenges');
        const select = document.getElementById('retoId');
        select.innerHTML = '<option value="" disabled selected>Selecciona un Reto</option>';
        container.innerHTML = retos.map(reto => `
            <div>
                <h3>${reto.titulo}</h3>
                <p>${reto.descripcion}</p>
            </div>
        `).join('');

        retos.forEach(reto => {
            const option = document.createElement('option');
            option.value = reto._id;
            option.textContent = reto.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al obtener retos:', error);
    }
}
