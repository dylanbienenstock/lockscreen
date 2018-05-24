import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcosahedronComponent } from './icosahedron.component';

describe('IcosahedronComponent', () => {
  let component: IcosahedronComponent;
  let fixture: ComponentFixture<IcosahedronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcosahedronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcosahedronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
