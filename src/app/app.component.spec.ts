import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      imports: [

      ],
      providers: [{provide: APP_BASE_HREF, useValue: '/'}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should appear the text of welcome', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // expect(by.id('textWelcome')).toEqual('Bienvenidos');
  }));
});
