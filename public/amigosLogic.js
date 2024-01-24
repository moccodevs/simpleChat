const socket = io(`localhost:3000`);

document.addEventListener('DOMContentLoaded', async () => {
        const usuarios = await obtenerUsuariosConectados();
        console.log(usuarios);
        llenarMenuDesplegable(usuarios);
    });
    async function obtenerUsuariosConectados() {
        return new Promise(resolve => {
            socket.emit('verAmigos', (usuarios) => {
                resolve(usuarios);
            });
        });
    }

    function llenarMenuDesplegable(usuarios) {
        const selectUsuarios = document.getElementById('selectUsuarios');

        usuarios.forEach(usuario => {
            const opcionUsuario = document.createElement('option');
            opcionUsuario.value = usuario.amigo;
            opcionUsuario.textContent = usuario.amigo;
            selectUsuarios.appendChild(opcionUsuario);
        });
    }

    function establecerChat() {
        const usuarioId = document.getElementById('selectUsuarios').value;

        if (usuarioId) {
            console.log(`Chat con el usuario ${usuarioId}`);
            // Puedes llamar a funciones adicionales para manejar el chat en el frontend
        } else {
            console.log("Selecciona un amigo para iniciar el chat.");
        }
    }