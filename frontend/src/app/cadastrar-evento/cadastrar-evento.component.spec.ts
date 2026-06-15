import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { CadastrarEventoComponent } from './cadastrar-evento.component';

describe('CadastrarEventoComponent', () => {
  let component: CadastrarEventoComponent;
  let fixture: ComponentFixture<CadastrarEventoComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarEventoComponent, HttpClientTestingModule],
      providers: [{ provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CadastrarEventoComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the event to the API when the form is valid', () => {
    component.formularioPalestras.setValue({
      titulo: 'Angular',
      descricao: 'Workshop',
      nomePalestrante: 'Ana',
      localEvento: 'Sala 1',
      dataEvento: '2026-06-20T10:00'
    });

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:3000/api/eventos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(jasmine.objectContaining({ titulo: 'Angular' }));

    req.flush({ message: 'Evento cadastrado com sucesso!' });

    expect(component.mensagem).toContain('Evento cadastrado');
  });
});
