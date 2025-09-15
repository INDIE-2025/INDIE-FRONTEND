import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit, OnDestroy {
  newPasswordForm: FormGroup;
  isLoading = false;
  isPasswordVisible = false;
  isConfirmPasswordVisible = false;
  token: string | null = null;
  isValidToken = true;
  isPasswordReset = false;
  errorMessage = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.newPasswordForm = this.fb.group({
      password: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  ngOnInit(): void {
    // Obtener el token de los query parameters
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.token = params['token'];
        if (!this.token) {
          this.isValidToken = false;
          this.errorMessage = 'Token de recuperación no válido o faltante';
        } else {
          this.validateToken();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  validateToken(): void {
    if (!this.token) return;
    
    this.authService.validateResetToken(this.token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isValidToken = true;
        },
        error: (error) => {
          this.isValidToken = false;
          this.errorMessage = 'El token de recuperación ha expirado o no es válido';
          this.toastr.error(
            this.errorMessage,
            'Error de Validación',
            {
              timeOut: 5000,
              progressBar: true,
              closeButton: true
            }
          );
        }
      });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  onSubmit(): void {
    if (this.newPasswordForm.valid && this.token && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { password } = this.newPasswordForm.value;
      
      this.authService.resetPassword(this.token, password)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isPasswordReset = true;
            this.isLoading = false;
            
            // Redirigir al login después de 3 segundos
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Error al restablecer la contraseña. Inténtalo de nuevo.';
          }
        });
    }
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.newPasswordForm.get('password');
    
    if (passwordControl?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    
    if (passwordControl?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (passwordControl?.hasError('pattern')) {
      return 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo';
    }
    
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    const confirmPasswordControl = this.newPasswordForm.get('confirmPassword');
    
    if (confirmPasswordControl?.hasError('required')) {
      return 'Confirma tu contraseña';
    }
    
    if (confirmPasswordControl?.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }
    
    return '';
  }

  hasMinLength(): boolean {
    const password = this.newPasswordForm.get('password')?.value || '';
    return password.length >= 8;
  }

  hasUppercase(): boolean {
    const password = this.newPasswordForm.get('password')?.value || '';
    return /[A-Z]/.test(password);
  }

  hasLowercase(): boolean {
    const password = this.newPasswordForm.get('password')?.value || '';
    return /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.newPasswordForm.get('password')?.value || '';
    return /\d/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.newPasswordForm.get('password')?.value || '';
    return /[@$!%*?&]/.test(password);
  }
}
