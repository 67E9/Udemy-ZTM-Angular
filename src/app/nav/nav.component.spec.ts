import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { NavComponent } from './nav.component';
import { AuthService } from '../services/auth.service'
import { RouterTestingModule } from '@angular/router/testing'
import { By } from '@angular/platform-browser';
 
//example for mock-service
describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  const mockedAuthService = jasmine.createSpyObj(
    'AuthService',
    ['createUser', 'logout'],
    { isAuthenticated$: of(true) }
    //return observable of isAuthenticated$: true, if AuthService.createUser() or .logout() are called
  )

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavComponent ],
      imports: [RouterTestingModule],
      //import replacement for RouterModule for tests
      providers: [{
        provide: AuthService,
        useValue: mockedAuthService
      }]
      //inject the mock instead of the firebase-service into the component
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to click logout', () => {
    const logoutLink = fixture.debugElement.query(By.css('li:nth-child(3) a'));

    expect(logoutLink).toBeTruthy();
    expect((logoutLink.nativeElement as HTMLAnchorElement).innerHTML).toContain("Logout")

    logoutLink.triggerEventHandler('click');
    //issue a click event on the logoutlink

    const service = TestBed.inject(AuthService);

    expect(service.logout)
      .withContext("could ot click logout link")
      .toHaveBeenCalledTimes(1);
      //jasmin SpyObj (mock for AuthService) registers clicks and lets us assess how often click has been triggered

  });
});
