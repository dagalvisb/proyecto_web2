export const API_CONFIG = {
  baseUrl: 'https://localhost:7248/api',
  endpoints: {
    /*usuarios: '/Usuarios/ListaUsuario',
    usuario: '/Usuarios/verUsuario',
    crearUsuario: '/Usuarios/CrearUsuario',
    editarUsuario: '/Usuarios/EditarUsuario',
    eliminarUsuario: '/Usuarios/EliminarUsuario'*/
    usuarios: '/Usuarios',
    materias: '/Materias',
    incmaterias: '/IncMaterias'
    
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
