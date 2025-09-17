import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuarui.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosSubject = new BehaviorSubject<Usuario[]>(this.getInitialUsuarios());
  public usuarios$ = this.usuariosSubject.asObservable();


  constructor() {}
  
    private getInitialUsuarios(): Usuario[] {
      return [
        
        {
          id: 1,
          nombre: "Daniel Galvis",
          lugarNacimiento: "Manizales",
          dni: "1053814829",
          correo: "dagalvisb@gmail.com",
          direccion: "Vereda la Aurora",
          cp: "170001",
          ciudad: "Manizales",
          movil: "3193949304",
          fecha: new Date('2025-09-15'),
          firma: "Daniel",
          bloque1: '',
          bloque2: '',
          createdDate: new Date('2024-01-15'),
          updatedDate: new Date('2024-01-15')
        },
        {
          id: 2,
          nombre: "Laura Fernández",
          lugarNacimiento: "Medellín",
          dni: "1053825734",
          correo: "laura.fernandez@hotmail.com",
          direccion: "Calle 45 #12-34",
          cp: "050021",
          ciudad: "Medellín",
          movil: "3124567890",
          fecha: new Date('2025-09-16'),
          firma: "Laura",
          bloque1: '',
          bloque2: '',
          createdDate: new Date('2024-02-10'),
          updatedDate: new Date('2024-02-10')
        },
        {
          id: 3,
          nombre: "Carlos Ramírez",
          lugarNacimiento: "Bogotá",
          dni: "1012456789",
          correo: "carlos.ramirez@outlook.com",
          direccion: "Carrera 10 #20-45",
          cp: "110111",
          ciudad: "Bogotá",
          movil: "3009876543",
          fecha: new Date('2025-09-14'),
          firma: "Carlos",
          bloque1: '',
          bloque2: '',
          createdDate: new Date('2024-03-05'),
          updatedDate: new Date('2024-03-05')
        },
        {
          id: 4,
          nombre: "Mariana Torres",
          lugarNacimiento: "Cali",
          dni: "1145897321",
          correo: "mariana.torres@gmail.com",
          direccion: "Avenida 6N #34-22",
          cp: "760045",
          ciudad: "Cali",
          movil: "3156784321",
          fecha: new Date('2025-09-13'),
          firma: "Mariana",
          bloque1: '',
          bloque2: '',
          createdDate: new Date('2024-04-12'),
          updatedDate: new Date('2024-04-12')
        },
        {
          id: 5,
          nombre: "Andrés López",
          lugarNacimiento: "Pereira",
          dni: "1098765432",
          correo: "andres.lopez@yahoo.com",
          direccion: "Barrio San Joaquín, Calle 12 #8-14",
          cp: "660003",
          ciudad: "Pereira",
          movil: "3187654321",
          fecha: new Date('2025-09-12'),
          firma: "Andrés",
          bloque1: '',
          bloque2: '',
          createdDate: new Date('2024-05-08'),
          updatedDate: new Date('2024-05-08')
        }
      ];
    }
  
    // Obtener todos los usuarios
    getUsuario(): Observable<Usuario[]> {
      return this.usuarios$;
    }
  
    // Obtener un usuarios por ID
    getUsuarioById(id: number): Usuario | undefined {
      const usuarios = this.usuariosSubject.value;
      return usuarios.find(usuario => usuario.id === id);
    }
    
    // Crear un nuevo Usuarios
    createUsuario(usuario: Omit<Usuario, 'id' | 'createdDate' | 'updatedDate'>): Usuario {
      const usuarios = this.usuariosSubject.value;
      const newUsuario: Usuario = {
        ...usuario,
        id: this.generateId(),
        createdDate: new Date(),
        updatedDate: new Date()
      };

      const updatedUsuarios = [...usuarios, newUsuario];
      this.usuariosSubject.next(updatedUsuarios);
      return newUsuario;
    }

    /* Crear un nuevo producto
    createProduct(product: Omit<Product, 'id' | 'createdDate' | 'updatedDate'>): Product {
      const products = this.productsSubject.value;
      const newProduct: Product = {
        ...product,
        id: this.generateId(),
        createdDate: new Date(),
        updatedDate: new Date()
      };
      
      const updatedProducts = [...products, newProduct];
      this.productsSubject.next(updatedProducts);
      return newProduct;
    }*/

    //Actualizar un Usuario existente
    updateUsuario(id: number, usuario: Partial<Omit<Usuario, 'id' | 'createdDate'>>): Usuario | null {
      const usuarios = this.usuariosSubject.value;
      const index = usuarios.findIndex(u => u.id === id);

      if (index === -1) {
        return null;
      }

      const updatedUsuario: Usuario = {
        ...usuarios[index],
        ...usuario,
        updatedDate: new Date()
      };

      const updatedUsuarios = [...usuarios];
      updatedUsuarios[index] = updatedUsuario;
      this.usuariosSubject.next(updatedUsuarios);

      return updatedUsuario;
    }
  
    /* Actualizar un producto existente
    updateProduct(id: number, product: Partial<Omit<Product, 'id' | 'createdDate'>>): Product | null {
      const products = this.productsSubject.value;
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        return null;
      }
  
      const updatedProduct: Product = {
        ...products[index],
        ...product,
        updatedDate: new Date()
      };
  
      const updatedProducts = [...products];
      updatedProducts[index] = updatedProduct;
      this.productsSubject.next(updatedProducts);
      
      return updatedProduct;
    }*/

    //Eliminar un Usuario
    deleteUsuario(id: number): boolean {
      const usuarios = this.usuariosSubject.value;
      const index = usuarios.findIndex(u => u.id === id);

      if (index === -1) {
        return false;
      }

      const updatedUsuarios = usuarios.filter(u => u.id !== id);
      this.usuariosSubject.next(updatedUsuarios);
      return true;
    }
  
    /*/ Eliminar un producto
    deleteProduct(id: number): boolean {
      const products = this.productsSubject.value;
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        return false;
      }
  
      const updatedProducts = products.filter(p => p.id !== id);
      this.productsSubject.next(updatedProducts);
      return true;
    }*/

    //Generar ID único
    private generateId(): number {
      const usuarios = this.usuariosSubject.value;
      return Math.max(...usuarios.map(u => u.id), 0) + 1;
    }
  
    /* Generar ID único
    private generateId(): number {
      const products = this.productsSubject.value;
      return Math.max(...products.map(p => p.id), 0) + 1;
    }*/
    
    // Buscar Usuarios por nombre o dni
    searchUsuarios(query: string): Usuario[] {
      const usuarios = this.usuariosSubject.value;
      const lowercaseQuery = query.toLowerCase();

      return usuarios.filter(usuario => 
        usuario.nombre.toLowerCase().includes(lowercaseQuery) ||
        usuario.dni.toLowerCase().includes(lowercaseQuery) ||
        usuario.correo.toLowerCase().includes(lowercaseQuery)
      );
    }

    /* Buscar productos por nombre o categoría
    searchProducts(query: string): Product[] {
      const products = this.productsSubject.value;
      const lowercaseQuery = query.toLowerCase();
      
      return products.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery)
      );
    }*/
}
