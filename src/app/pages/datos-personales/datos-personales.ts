import { Component, inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { PopupService } from '../../services/popup.service';
import { UserService } from '../../services/user.service';
import { Usuario } from '../../core/models/usuario.model';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";

// Custom validator para comparar contraseñas
export function matchingPasswords(controlName: string, matchingControlName: string) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    if (matchingControl.errors && !matchingControl.errors['matching']) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ matching: true });
      return { matching: true };
    } else {
      matchingControl.setErrors(null);
      return null;
    }
  };
}

@Component({
  selector: 'app-datos-personales',
  imports: [ReactiveFormsModule, MatInputModule, MatIconModule],
  templateUrl: './datos-personales.html',
  styleUrl: './datos-personales.scss',
  standalone: true
})
export class DatosPersonales implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  popupMessage: string = '';
  popupVisible: boolean = false;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  submitted = false;
  passwordSubmitted = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  profileImageUrl: string | null = null;
  currentUser: Usuario | null = null;
  showDeleteModal = false;

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  private dialogRef = inject(DialogRef, {optional: true});
  
  protected closeModal() {
    this.dialogRef?.close();
  }

  ngOnInit() {
    // Initialize form
    this.initForm();
    
    // Load user data
    this.userService.getUsuarioActual().subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.loadUserData();
      }
    });
  }

  get f() { 
    return this.profileForm.controls; 
  }

  get pf() {
    return this.passwordForm.controls;
  }

  initForm() {
    this.profileForm = this.formBuilder.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      emailUsuario: ['', [Validators.required, Validators.email]],
      youtubeUsuario: [''],
      spotifyUsuario: [''],
      instagramUsuario: [''],
      subTipoUsuario: [''],
      apellidoUsuario: [''],
      descripcionUsuario: [''],
      ubicacion: [''],
      sitioWeb: ['', Validators.pattern('https?://.+')],
    },
);

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: matchingPasswords('newPassword', 'confirmPassword')
    });
  }

  loadUserData() {
    if (!this.currentUser) return;

    // If there is a mock profile image, use it
    this.profileImageUrl = 'assets/logo/images/artist1.jpg';

    const defaultDescription = 'Artista y productor musical con mas de 5 anos de experiencia en la escena indie.';

    this.profileForm.patchValue({
      nombreUsuario: this.currentUser.nombreUsuario || '',
      apellidoUsuario: this.currentUser.apellidoUsuario || '',
      emailUsuario: this.currentUser.emailUsuario || '',
      subTipoUsuario: this.currentUser.subtipoUsuario || '',
      descripcionUsuario: this.currentUser.descripcionUsuario || defaultDescription,
      ubicacion: this.currentUser.ubicacion || 'Buenos Aires, Argentina',
      sitioWeb: this.currentUser.sitioWeb || 'https://www.ejemplo.com',
      youtubeUsuario: this.currentUser.youtubeUsuario || '',
      spotifyUsuario: this.currentUser.spotifyUsuario || '',
      instagramUsuario: this.currentUser.instagramUsuario || ''
    });
  }
  getUserInitials(): string {
    if (this.currentUser?.nombreUsuario) {
      return this.currentUser.nombreUsuario.charAt(0).toUpperCase();
    }
    return 'U';
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // For demo purposes we'll just create a local URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
        this.popupService.show('Foto de perfil actualizada');
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfilePic() {
    this.profileImageUrl = null;
    this.popupService.show('Foto de perfil eliminada');
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }
  saveChanges() {
    this.submitted = true;

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValue = this.profileForm.value;

    const userData = {
      id: this.currentUser?.id,
      nombreUsuario: formValue.nombreUsuario,
      apellidoUsuario: formValue.apellidoUsuario,
      emailUsuario: formValue.emailUsuario,
      subtipoUsuario: formValue.subTipoUsuario,
      descripcionUsuario: formValue.descripcionUsuario,
      ubicacion: formValue.ubicacion,
      sitioWeb: formValue.sitioWeb,
      youtubeUsuario: formValue.youtubeUsuario,
      spotifyUsuario: formValue.spotifyUsuario,
      instagramUsuario: formValue.instagramUsuario
    };

    this.userService.updatePerfil(this.currentUser?.emailUsuario || '', userData as Usuario).subscribe({
      next: async (updatedUser) => {
        this.currentUser = updatedUser;
        this.popupService.show('Datos guardados correctamente');
        await this.userService.setMe();
        this.submitted = false;
      },
      error: () => {
        this.popupService.show('Error al guardar los datos');
      }
    });
  }

  changePassword() {
    this.passwordSubmitted = true;
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const passwordData = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.userService.changePassword(this.currentUser?.emailUsuario || '', passwordData).subscribe({
      next: () => {
        this.popupService.show('Contrasena actualizada correctamente');
        this.resetForm('Password');
      },
      error: () => {
        this.popupService.show('Error al actualizar la contrasena');
      }
    });
  }

  resetForm(option?: string) {
    this.submitted = false;
    this.passwordSubmitted = false;
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.loadUserData();

    if (option === 'Password') {
      this.passwordForm.reset();
    }
  }

  showDeleteConfirmation() {
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
  }

  deleteAccount() {
    // In a real application, you would delete the user account here
    this.popupService.show('Cuenta eliminada');
    this.showDeleteModal = false;
    // Redirect to login page or similar
  }


}

















