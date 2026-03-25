import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyConfigurations } from './my-configurations';

describe('MyConfigurations', () => {
  let component: MyConfigurations;
  let fixture: ComponentFixture<MyConfigurations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyConfigurations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyConfigurations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
