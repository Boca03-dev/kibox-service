import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Configurator } from './configurator';

describe('Configurator', () => {
  let component: Configurator;
  let fixture: ComponentFixture<Configurator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Configurator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Configurator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
