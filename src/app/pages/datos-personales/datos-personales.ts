import { Component, inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { PopupService } from '../../services/popup.service';
import { UserService, Usuario } from '../../services/user.service';

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
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './datos-personales.html',
  styleUrl: './datos-personales.scss',
  standalone: true
})
export class DatosPersonales implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  popupMessage: string = '';
  popupVisible: boolean = false;
  profileForm!: FormGroup;
  submitted = false;
  passwordChangeAttempted = false;
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

  initForm() {
    this.profileForm = this.formBuilder.group({
      nombreUsuario: ['', Validators.required],
      emailUsuario: ['', [Validators.required, Validators.email]],
      bio: [''],
      ubicacion: [''],
      sitioWeb: ['', Validators.pattern('https?://.+')],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, {
      validators: matchingPasswords('newPassword', 'confirmPassword')
    });
  }

  loadUserData() {
    if (!this.currentUser) return;

    // If there's a mock profile image, use it
    this.profileImageUrl = 'assets/logo/images/artist1.jpg';  // Use mock image for demo

    // Patch form with user data
    this.profileForm.patchValue({
      nombreUsuario: this.currentUser.nombreUsuario || '',
      emailUsuario: this.currentUser.emailUsuario || '',
      bio: 'Artista y productor musical con más de 5 años de experiencia en la escena indie.',
      ubicacion: 'Buenos Aires, Argentina',
      sitioWeb: 'https://www.ejemplo.com'
    });
  }

  getUserInitials(): string {
    if (this.currentUser && this.currentUser.nombreUsuario) {
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

  saveChanges() {
    this.submitted = true;

    // Check if password fields are filled
    this.passwordChangeAttempted = !!(
      this.profileForm.get('currentPassword')?.value || 
      this.profileForm.get('newPassword')?.value || 
      this.profileForm.get('confirmPassword')?.value
    );

    // Validate password change attempt
    if (this.passwordChangeAttempted) {
      if (!this.profileForm.get('currentPassword')?.value) {
        this.profileForm.get('currentPassword')?.setErrors({ required: true });
      }
    }

    // Stop if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    // Prepare user data (exclude password fields)
    const userData = {
      id: this.currentUser?.id,
      nombreUsuario: this.profileForm.get('nombreUsuario')?.value,
      emailUsuario: this.profileForm.get('emailUsuario')?.value,
      // Add additional fields as needed
    };

    // In a real application, you would update the user data here
    this.popupService.show('Datos guardados correctamente');
  }

  resetForm() {
    this.submitted = false;
    this.passwordChangeAttempted = false;
    this.loadUserData();
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
