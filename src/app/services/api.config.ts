export const API_CONFIG = {
  baseUrl: 'https://localhost:7248/api',
  endpoints: {
    usuarios: '/Usuarios/listaUsuarios',
    usuario: '/Usuarios/verUsuario',
    crearUsuario: '/Usuarios/crearUsuario',
    editarUsuario: '/Usuarios/editarUsuarios',
    eliminarUsuario: '/Usuarios/eliminarUsuarios'
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
