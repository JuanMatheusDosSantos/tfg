import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidationErrors
} from '@angular/forms'; // Asegúrate de que ReactiveFormsModule esté aquí
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
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone:["",[Validators.required,Validators.minLength(9),Validators.maxLength(9), Validators.pattern(/^[0-9]{9}$/)]],
      birthdate: ['', [Validators.required, this.edadValidator(18, 70)]],
      terms:[false,Validators.requiredTrue],
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
        console.error('Error completo:', err);

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

  edadValidator(minAge: number, maxAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const hoy = new Date();
      const nacimiento = new Date(control.value);
      const edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      const edadReal = mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())
        ? edad - 1
        : edad;

      if (edadReal < minAge) return { edadMinima: { requerida: minAge, actual: edadReal } };
      if (edadReal > maxAge) return { edadMaxima: { requerida: maxAge, actual: edadReal } };

      return null;
    };
  }
}
