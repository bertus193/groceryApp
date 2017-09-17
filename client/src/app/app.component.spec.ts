import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { SocketConnection } from './sdk/sockets/socket.connections';


import { BrowserModule } from '@angular/platform-browser';
import { SDKBrowserModule } from './sdk/index';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap';

import { Title } from '@angular/platform-browser';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule, HttpModule, SDKBrowserModule.forRoot(), AlertModule.forRoot(), FormsModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));


  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));


  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('ToDo App');
  }));
});
