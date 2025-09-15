import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, CommonModule]
})
export class PasswordRecoveryComponent implements OnDestroy {

  recoveryForm: FormGroup;
  isEmailSent: boolean = false;
  isLoading: boolean = false;
  countdown: number = 0;
  countdownInterval: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.recoveryForm.valid) {
      this.isLoading = true;
      const email = this.recoveryForm.value.email;

      // Llamada al servicio de recuperación
      this.auth.requestPasswordReset(email).subscribe({
        next: () => {
          this.isEmailSent = true;
          this.isLoading = false;
          this.startCountdown();
        },
        error: (err: any) => {
          console.error('Error al enviar email de recuperación:', err);
          const errorMessage = err.error?.message || 
                              err.error?.error || 
                              err.error ||
                              'Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.';
          this.toastr.error(
            errorMessage,
            'Error de Autenticación',
            {
              timeOut: 5000,
              progressBar: true,
              closeButton: true
            }
          );
          this.isLoading = false;
        }
      });
    } else {
      this.recoveryForm.markAllAsTouched();
    }
  }

  resendEmail() {
    if (this.countdown === 0) {
      this.onSubmit();
    }
  }

  startCountdown() {
    // Limpiar cualquier intervalo previo antes de crear uno nuevo
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    this.countdown = 30; // 30 segundos
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }, 1000);
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.recoveryForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'El email es requerido';
      if (field.errors['email']) return 'Ingresa un email válido';
    }
    return '';
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}









