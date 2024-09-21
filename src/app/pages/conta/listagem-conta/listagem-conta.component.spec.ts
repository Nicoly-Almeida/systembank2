import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemContaComponent } from './listagem-conta.component';

describe('ListagemContaComponent', () => {
  let component: ListagemContaComponent;
  let fixture: ComponentFixture<ListagemContaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListagemContaComponent]
    });
    fixture = TestBed.createComponent(ListagemContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
