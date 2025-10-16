export interface Usuario {
    id: number;
    nombre: string;
    lugarNacimiento: string;
    dni: string;
    correo: string;
    direccion: string;
    cp: string;
    ciudad: string;
    movil: string;
    firma: string;
    bloque1?: string;
    bloque2?: string;
    tipo_usuario: string;
    createdDate: Date;
    updatedDate: Date;   
}

