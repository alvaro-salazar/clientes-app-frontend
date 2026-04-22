import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ClienteFormComponent } from './cliente-form.component';

describe('ClienteFormComponent', () => {
  let component: ClienteFormComponent;
  let fixture: ComponentFixture<ClienteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClienteFormComponent],
      providers: [NgbActiveModal],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteFormComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
