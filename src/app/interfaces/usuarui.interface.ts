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
    fecha: Date;
    firma: string;
    bloque1?: string;
    bloque2?: string;
    createdDate: Date;
    updatedDate: Date;   
}

