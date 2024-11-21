// auth.js
const API_URL = 'http://localhost:5001/api';

// Función para registrar un usuario
export async function register(nombre, email, password, rol = 'usuario') {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol }),
    });

    if (!response.ok) {
        throw new Error('Error en el registro');
    }
    return await response.json();
}

// Función para iniciar sesión
export async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Error en el inicio de sesión');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('rol', data.rol);
    localStorage.setItem('nombre', data.nombre);
    return data;
}

// Función para cerrar sesión
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
}

// Función para obtener el token
export function getToken() {
    return localStorage.getItem('token');
}

// Función para obtener el rol
export function getUserRole() {
    return localStorage.getItem('rol');
}
