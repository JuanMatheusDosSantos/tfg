import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms'; // Asegúrate de que ReactiveFormsModule esté aquí
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  errorMessage = '';
  registerForm!: FormGroup;

  showPassword= false;
  constructor() {}

  ngOnInit(){
    this.registerForm = this.fb.group({
      name:["",[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phone:["",[Validators.required,Validators.minLength(9),Validators.maxLength(9)]],
      age:["",[Validators.required,Validators.min(18),Validators.max(70)]],
      terms:[false,Validators.requiredTrue]
    });
  }

  onSubmit() {
    this.errorMessage = '';

    const credentials = this.registerForm.value;
    this.auth.register(credentials).subscribe({
      next: () => {
        // this.router.navigate(['/login']);
        this.auth.login({
          email:credentials.email,
          password:credentials.password
        }).subscribe({
          next:()=>{
            this.router.navigate(["/"])
          }
        })
      },
      error: (err) => {
        console.error('Error completo:', err); // Mira esto en la consola del navegador

        if (err.status === 422) {
          // Laravel devuelve los errores en err.error.errors
          const validationErrors = err.error.errors;
          if (validationErrors) {
            // Esto junta todos los errores de Laravel en una frase
            this.errorMessage = Object.values(validationErrors).flat().join(', ');
          } else {
            this.errorMessage = 'Datos de registro inválidos.';
          }
        } else if (err.status === 409) {
          this.errorMessage = 'Este correo electrónico ya está registrado.';
        } else {
          this.errorMessage = 'Error de conexión con el servidor.';
        }
      },
    });
  }
  switchPassword(){
    this.showPassword=!this.showPassword;
  }
}
