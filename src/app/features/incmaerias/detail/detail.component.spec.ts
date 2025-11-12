import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DetailComponent } from './detail.component';
import { IncmateriasService } from '../../../services/incmaterias.service';
import { IncMateria } from '../../../interfaces/incmaterias.interface';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let incmateriasService: jasmine.SpyObj<IncmateriasService>;
  let router: jasmine.SpyObj<Router>;

  const mockIncMateria: IncMateria = {
    id: 1,
    usuario: 'juan.perez',
    materia: 'Matemáticas',
    createdDate: new Date('2023-01-01T10:00:00Z'),
  };

  beforeEach(async () => {
    const incmateriasServiceSpy = jasmine.createSpyObj('IncmateriasService', 
      ['getIncMateriaById', 'deleteIncMateria']
    );
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DetailComponent],
      providers: [
        { provide: IncmateriasService, useValue: incmateriasServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? '1' : null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    incmateriasService = TestBed.inject(IncmateriasService) as jasmine.SpyObj<IncmateriasService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load IncMateria on init', fakeAsync(() => {
      incmateriasService.getIncMateriaById.and.returnValue(of(mockIncMateria));

      component.ngOnInit();
      tick(); // Espera a que se complete el observable

      expect(incmateriasService.getIncMateriaById).toHaveBeenCalledWith(1);
      expect(component.IncMateria).toEqual(mockIncMateria);
    }));

    it('should handle error when loading IncMateria fails', fakeAsync(() => {
      
      const errorMessage = 'Error occurred';
      incmateriasService.getIncMateriaById.and.returnValue(throwError(() => ({ message: errorMessage })));
      component.ngOnInit();
      tick(); // Espera a que se complete el observable
      expect(component.error).toBe(errorMessage);
    }));

  });

  describe('onDeleteIncMateria', () => {
    beforeEach(() => {
      component.IncMateria = mockIncMateria;
    });

    it('should delete IncMateria and navigate on success', fakeAsync(() => {
    
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(window, 'alert');
      incmateriasService.deleteIncMateria.and.returnValue(of(true));

      component.onDeleteIncMateria();
      tick(); 

      expect(window.confirm).toHaveBeenCalledWith('¿Está seguro de que desea eliminar este incMateria?');
      expect(incmateriasService.deleteIncMateria).toHaveBeenCalledWith(1);
      expect(window.alert).toHaveBeenCalledWith('IncMateria eliminada exitosamente');
      expect(router.navigate).toHaveBeenCalledWith(['/incMaterias']);
    }));

    it('should handle error when deletion fails', fakeAsync(() => {
 
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(window, 'alert');
      const error = { message: 'Error deleting IncMateria' };
      incmateriasService.deleteIncMateria.and.returnValue(throwError(() => error));

      component.onDeleteIncMateria();
      tick(); // Espera a que se complete el observable

      expect(window.confirm).toHaveBeenCalledWith('¿Está seguro de que desea eliminar este incMateria?');
      expect(incmateriasService.deleteIncMateria).toHaveBeenCalledWith(1);
      expect(window.alert).toHaveBeenCalledWith('Error al eliminar el incMateria: Error deleting IncMateria');
      expect(component.error).toBe('Error deleting IncMateria');
    }));

    it('should not delete when user cancels confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.onDeleteIncMateria();
      expect(incmateriasService.deleteIncMateria).not.toHaveBeenCalled();
    });
  });

  describe('onClearError', () => {
    it('should clear error', () => {
      component.error = 'Some error';
      component.onClearError();
      expect(component.error).toBeNull();
    });
  });
});