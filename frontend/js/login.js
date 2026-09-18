// S17: LOGIN - conecta el formulario con la API

const formLogin = document.querySelector('#form-login');

formLogin.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    // Limpiar errores anteriores
    document.querySelector('#error-login-email').textContent = '';
    document.querySelector('#error-login-password').textContent = '';

    // 1. Leer los valores del formulario
    const email  = document.querySelector('#login-email').value.trim();
    const password  = document.querySelector('#login-password').value;

    // 2. Validación básica
    if (!email) {
        document.querySelector('#error-login-email').textContent = 'Ingresa tu correo';
        return;
    }
    if (!password) {
        document.querySelector('#error-login-password').textContent = 'Ingresa tu contraseña';
        return;
    }

    try {
        // 3. llamar al backend
        const respuesta = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body:   JSON.stringify({ email: email, password: password })
        });
        const datos = await respuesta.json();

        // 4a. Si el backend devolvio error
        if (!respuesta.ok) {
            document.querySelector('#error-login-email').textContent =
            datos.error || 'Correo o contraseña incorrectos';
            return;
        }

        // 4b. login exitoso - guardar token
        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario-nombre', datos.nombre);
        localStorage.setItem('usuario-rol', datos.rol);

        // 5. CORRECCIÓN: Redirección inmediata al index en lugar de mostrar bienvenida
        formLogin.reset();
        window.location.href = 'index.html';
     
    }   catch (error) {
        // 6. Error de red
        document.querySelector('#error-login-email').textContent =
        'No se pudo conectar. Verifica que npm run dev este corriendo.';
    }
});
