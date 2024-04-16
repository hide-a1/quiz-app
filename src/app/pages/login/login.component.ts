import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  auth = inject(AuthService);

  constructor() {
    effect(() => {
      console.log(this.auth.$user());
    });
  }

  signIn() {
    this.auth.signIn();
  }

  signOut() {
    this.auth.signOut();
  }
}
