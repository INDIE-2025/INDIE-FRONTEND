import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatCheckboxModule]
})
export class LoginComponent {

  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      emailUsuario: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = {
        emailUsuario: this.loginForm.value.emailUsuario,
        password: this.loginForm.value.password
      };

      this.auth.login(formData).subscribe({
        next: () => {
          // Si "recordarme" está marcado, podrías guardar algún flag adicional
          if (this.loginForm.value.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }          
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error en login:', err);
          
          // Extraer mensaje de error del backend o usar uno genérico
          const errorMessage = err.error?.message || 
                              err.error?.error || 
                              err.error ||
                              'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
          
          this.toastr.error(
            errorMessage,
            'Error de Autenticación',
            {
              timeOut: 5000,
              progressBar: true,
              closeButton: true
            }
          );
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      
      // Mostrar toast de error para formulario inválido
      this.toastr.warning(
        'Por favor, completa todos los campos requeridos correctamente.',
        'Formulario Incompleto',
        {
          timeOut: 4000,
          progressBar: true
        }
      );
    }
  }

  // Getter para verificar si el botón debe estar habilitado
  get isFormValid(): boolean {
    return this.loginForm.valid;
  }

  // Método para verificar si un campo tiene errores y ha sido tocado
  hasError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  // Método para obtener el mensaje de error específico
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}









