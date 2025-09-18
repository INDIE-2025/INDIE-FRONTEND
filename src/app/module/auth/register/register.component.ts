import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NotifyService } from '../../../core/services/notify.service';
import { SubTipoUsuario } from '../../../core/models/subTipoUsuario.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatCheckboxModule]
})
export class RegisterComponent implements OnInit {
  
  registerForm: any;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  subTiposUsuario: SubTipoUsuario[] = [];
  tiposUsuario: string[] = [];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private notify: NotifyService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      nombreUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      emailUsuario: ['', [Validators.required, Validators.email]],
      tipoUsuario: ['', [Validators.required]],
      subtipoUsuario: [''], 
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });

    this.auth.getSubTipoUsuario().subscribe({
      next: (data) => {
        this.subTiposUsuario = data;
        this.tiposUsuario = Array.from(new Set(data.map(stu => stu.nombreTipoUsuario)));
        console.log('SubTipos de Usuario cargados:', this.subTiposUsuario);
      },
      error: (err) => {
        console.error('Error al cargar SubTipos de Usuario:', err);
      }
    });

    // Escuchar cambios en tipoUsuario para manejar la validación de subtipoUsuario
    this.registerForm.get('tipoUsuario')?.valueChanges.subscribe((value: string) => {
      const subtipoControl = this.registerForm.get('subtipoUsuario');
      if (value === 'artista') {
        subtipoControl?.setValidators([Validators.required]);
      } else {
        subtipoControl?.clearValidators();
        subtipoControl?.setValue(''); // Limpiar el valor si no es artista
      }
      subtipoControl?.updateValueAndValidity();
    });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(form: any) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = {
        username: this.registerForm.value.username,
        nombreUsuario: this.registerForm.value.nombreUsuario,
        emailUsuario: this.registerForm.value.emailUsuario,
        tipoUsuario: this.registerForm.value.tipoUsuario,
        subTipoUsuarioId: this.subTiposUsuario.find(stu => stu.nombreSubTipoUsuario === this.registerForm.value.subtipoUsuario)?.id || null,
        password: this.registerForm.value.password
      };

      this.auth.register(formData).subscribe({
        next: () => {
          this.router.navigate(['/post-register']);
        },
        error: err => {
          console.error('Error en registro:', err);
          
          // Extraer mensaje de error del backend o usar uno genérico
          const errorMessage = err.error?.message || 
                              err.error?.error || 
                              err.error ||
                              'Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.';
          
          this.notify.error(errorMessage, 'Error en el Registro', 6000);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      
      // Mostrar toast de error para formulario inválido
      this.notify.warning('Por favor, completa todos los campos requeridos correctamente.', 'Formulario Incompleto', 4000);
    }
  }

  // Método para verificar si un campo tiene errores y ha sido tocado
  hasError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  // Método para obtener el mensaje de error específico
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['passwordMismatch']) return 'Las contraseñas no coinciden';
    }
    return '';
  }
}
