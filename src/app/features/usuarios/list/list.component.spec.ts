import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Usuario } from '../../../interfaces/usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';
import { ListComponent } from './list.component';


describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let loadingSubjet: BehaviorSubject<boolean>;
  let errorSubject: BehaviorSubject<string | null>;

  const mockUsuario: Usuario = {
    id: 1,
    nombre: 'Juan Perez',
    lugarNacimiento: 'Madrid',
    dni: '12345678A',
    correo: 'juan.perez@gmail.com',
    direccion: 'Calle Falsa 123',
    cp: '28080',
    ciudad: 'Madrid',
    movil: '600123456',
    firma: 'FirmaEjemplo',
    tipo_usuario: 'estudiante',
    createdDate: new Date('2023-01-01T10:00:00Z'),
    updatedDate: new Date('2023-06-01T12:00:00Z'),
  }



  beforeEach(async () => {

    loadingSubjet = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<string | null>(null);

    const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['getUsuarios', 'searchUsuarios', 'deleteUsuario', 'refreshUsuarios', 'clearError'], {
      loading$: loadingSubjet.asObservable(),
      error$: errorSubject.asObservable(),
    });


    await TestBed.configureTestingModule({
      imports: [ListComponent, RouterTestingModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
  });

  beforeEach(() => {
    usuarioService.getUsuarios.and.returnValue(of([mockUsuario]));
    loadingSubjet.next(false);
    errorSubject.next(null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to usuarios', () => {
      component.ngOnInit();
      expect(usuarioService.getUsuarios).toHaveBeenCalled();
      expect(component.usuarios).toEqual([mockUsuario]);
      expect(component.filteredUsuarios).toEqual([mockUsuario]);
    });

    it('should subscribe to loading$', () => {   
      component.ngOnInit();
      loadingSubjet.next(true);
      expect(component.loading).toBeTrue();
      loadingSubjet.next(false);
      expect(component.loading).toBeFalse();
    });

    it('should subscribe to error$', () => {
      component.ngOnInit();
      errorSubject.next('Error occurred');
      expect(component.error).toBe('Error occurred');
      errorSubject.next(null);
      expect(component.error).toBeNull();
    }); 
  });

  describe('ngOnDestroy', () => {
    
    it('should unsubscribe from all subscriptions', () => {
      component.ngOnInit();
      spyOn(component['subscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('onSearch', () => {
    it('should filter usuarios based on searchQuery', () => {
      component.ngOnInit();
      usuarioService.searchUsuarios.and.returnValue([mockUsuario]);
      component.searchQuery = 'Juan';
      component.onSearch();
      expect(usuarioService.searchUsuarios).toHaveBeenCalledWith('Juan');
      expect(component.filteredUsuarios).toEqual([mockUsuario]);
    });

    it('should reset filteredUsuarios if searchQuery is empty', () => {
      component.ngOnInit();
      component.searchQuery = '   ';
      component.onSearch();
      expect(component.filteredUsuarios).toEqual([mockUsuario]);
    });
  });

  describe('onSearch2', () => {
    it('should filter usuarios based on searchTipoUsuario', () => {
      component.ngOnInit();
      usuarioService.searchUsuarios.and.returnValue([mockUsuario]);
      component.searchTipoUsuario = 'estudiante';
      component.onSearch2();
      expect(usuarioService.searchUsuarios).toHaveBeenCalledWith('estudiante');
      expect(component.filteredUsuarios).toEqual([mockUsuario]);
    });

    it('should reset filteredUsuarios if searchTipoUsuario is empty', () => {
      component.ngOnInit();
      component.searchTipoUsuario = '   ';
      component.onSearch2();
      expect(component.filteredUsuarios).toEqual([mockUsuario]);
    });
  });

  describe ('onDeleteUsuario', () => {
    it('should call deleteUsuarios and refreshUsuarios', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(window, 'alert');
      usuarioService.deleteUsuario.and.returnValue(of(true));

      component.onDeleteUsuario(1);
      
      expect(window.confirm).toHaveBeenCalledWith('¿Está seguro de que desea eliminar este usuario?');
      expect(usuarioService.deleteUsuario).toHaveBeenCalledWith(1);
      expect(window.alert).toHaveBeenCalledWith('Usuario eliminado exitosamente');
    });

    it('should show alert on deleteUsuarios error', () => {
      
      
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(window, 'alert');
      const error = new Error('Delete failed');
      usuarioService.deleteUsuario.and.returnValue(throwError(() => error));

      component.onDeleteUsuario(1);
      expect(window.alert).toHaveBeenCalledWith(`Error al eliminar el producto: Delete failed`);
    });
  });

  describe('onClearSearch', () => {
    it('should clear search fields and reset filteredUsuarios', () => {
      component.ngOnInit();
      component.searchQuery = 'Juan';
      component.searchTipoUsuario = 'estudiante';
      component.onClearSearch();
      expect(component.searchQuery).toBe('');
      expect(component.searchTipoUsuario).toBe('');
      expect(component.filteredUsuarios).toEqual([mockUsuario]);
    });

  });

  describe('onRefresh', () => {
    it('should call refreshUsuarios', () => {
      component.onRefresh();
      expect(usuarioService.refreshUsuarios).toHaveBeenCalled();
    });
  });
  
  describe('onClearError', () => {
    it('should call clearError', () => {
      component.onClearError();
      expect(usuarioService.clearError).toHaveBeenCalled();
    });
  });
    
});
