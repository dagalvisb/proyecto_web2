import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UsuarioService } from '../../../services/usuario.service';
import { ListComponent } from './list.component';
import { Usuario } from '../../../interfaces/usuario.interface';
import { BehaviorSubject, of } from 'rxjs';
import { mock } from 'node:test';


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

    const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['getUsuarios', 'searchUsuarios', 'deleteUsuarios', 'refreshUsuarios', 'clearError'], {
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
      component.searchQuery = 'Juan';
      usuarioService.searchUsuarios.and.returnValue([mockUsuario]);
      component.onSearch();
      expect(usuarioService.searchUsuarios).toHaveBeenCalledWith('Juan');
      expect(component.filteredUsuarios).toEqual([mockUsuario]);
    });

    it('should reset filteredUsuarios if searchQuery is empty', () => {
      component.ngOnInit();
      component.searchQuery = '  ';
      component.onSearch();
      expect(component.filteredUsuarios).toEqual(component.usuarios);
    });
  });



});


