import {Component, inject, OnInit, signal} from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms'; // Asegúrate de que ReactiveFormsModule esté aquí
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  // IMPORTANTE: ReactiveFormsModule debe estar en este array
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  errorMessage = signal('');
  loginForm!: FormGroup;

  showPassword= false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }


  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.errorMessage.set('');
    const credentials = this.loginForm.value;

    this.auth.login(credentials).subscribe({
      next: () => {
        if (this.auth.isAdmin||this.auth.isPark||this.auth.isRestaurant){
          this.router.navigate(["admin"])
        }
        else {
          this.router.navigate(['/'])
        }
      },
      error: (err) => {
        this.errorMessage.set('Credenciales incorrectas o error de conexión');
        console.error(err);
      }
    });
  }
  switchPassword(){
    this.showPassword=!this.showPassword;
  }
}
