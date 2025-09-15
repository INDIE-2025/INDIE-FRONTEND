  
import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { PopupMessageComponent } from '../popup-message/popup-message';
import { PopupService } from '../../services/popup.service';
import { EventoService } from '../../services/evento.service';
import { CdkAutofill } from "@angular/cdk/text-field";
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-publicar-evento',
  standalone: true,
  imports: [ReactiveFormsModule, PopupMessageComponent],
  templateUrl: './publicar-evento.html',
  styleUrl: './publicar-evento.scss'
})

export class PublicarEvento implements OnInit {
  borradores: any[] = [];
  borradorSeleccionado: any = null;
  currentUserId: string | null = null;
  
  onBorradorSelect(event: Event) {
    const id = (event.target as HTMLSelectElement).value;
    if (!id) {
      this.borradorSeleccionado = null;
      this.applyForm.reset();
      return;
    }
    this.eventoService.getEventoPorId(id).subscribe({
      next: (evento) => {
        this.borradorSeleccionado = evento;
        this.applyForm.patchValue({
          nombreEvento: evento.titulo,
          fecha: evento.fechaHoraEvento ? evento.fechaHoraEvento.substring(0, 10) : '',
          hora: evento.fechaHoraEvento ? evento.fechaHoraEvento.substring(11, 16) : '',
          direccion: evento.ubicacion ? evento.ubicacion : '',
          descripcion: evento.descripcion ? evento.descripcion : ''
        });
      },
      error: () => this.popupService.show('No se pudo cargar el borrador')
    });
  }

  popupMessage: string = '';
  popupVisible: boolean = false;

  applyForm = new FormGroup({
    nombreEvento: new FormControl(''),
    hora: new FormControl(''),
    fecha: new FormControl(''),
    direccion: new FormControl(''),
    colaborador: new FormControl(''),
    descripcion: new FormControl(''),
  });



  constructor(
    private popupService: PopupService, 
    private eventoService: EventoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Debugging
    console.log('Token almacenado:', this.authService.getToken());
    console.log('¿Usuario autenticado?', this.authService.isAuthenticated());
    console.log('Usuario actual:', this.authService.getCurrentUser());
    
    this.currentUserId = this.authService.getCurrentUserId();
    console.log('ID del usuario actual:', this.currentUserId);
    
    if (!this.currentUserId) {
      // Si no hay usuario logueado, mostramos un mensaje de error
      this.popupService.show('No se ha detectado un usuario logueado. Por favor inicia sesión para publicar eventos.');
      // No asignamos un ID por defecto; bloqueamos acciones que requieren autenticación.
    }
    
    // Cargar borradores al iniciar el componente
    this.loadDrafts();
  }

  private loadDrafts(): void {
    if (!this.currentUserId) return;
    
    this.eventoService.getBorradoresPorUsuario(this.currentUserId).subscribe({
      next: (data) => this.borradores = data,
      error: () => this.popupService.show('No se pudieron cargar los borradores')
    });
  }

  private dialogRef = inject(DialogRef, {optional: true});
  protected closeModal() {
    this.dialogRef?.close();
  }

  guardarComoBorrador() {
    if (!this.currentUserId) {
      this.popupService.show('Necesitas iniciar sesión para guardar borradores.');
      return; // Cancelar la operación si no hay usuario
    }

    const form = this.applyForm.value;
    const eventoDTO = {
      titulo: form.nombreEvento,
      fechaHoraEvento: (form.fecha && form.hora) ? form.fecha + 'T' + form.hora : null,
      ubicacion: form.direccion ? form.direccion : null,
      descripcion: form.descripcion ? form.descripcion : null,
      idUsuario: this.currentUserId,
      estadoEvento: 'BORRADOR'
    };
    this.eventoService.guardarBorrador(eventoDTO).subscribe({
      next: () => {
        this.popupService.show('Borrador guardado!');
        // Refresh the drafts list
        this.loadDrafts();
      },
      error: (err) => {
        let errorMsg = 'Error al guardar borrador, el título es obligatorio';
        if (err && err.error && err.error.message) {
          errorMsg = err.error.message;
        }
        this.popupService.show(errorMsg);
      }
    });
  }

  submitApplication() {
    if (!this.currentUserId) {
      this.popupService.show('Necesitas iniciar sesión para publicar eventos.');
      return; // Cancelar la operación si no hay usuario
    }

    const form = this.applyForm.value;
    const { nombreEvento, hora, fecha, direccion, descripcion } = form;
    if (
      nombreEvento && nombreEvento.trim() !== '' &&
      hora && hora.trim() !== '' &&
      fecha && fecha.trim() !== '' &&
      direccion && direccion.trim() !== '' &&
      descripcion && descripcion.trim() !== ''
    ) {
      // Validación de fecha mayor a hoy
      const hoy = new Date();
      const fechaIngresada = new Date(fecha + 'T' + hora);
      if (fechaIngresada <= hoy) {
        this.popupService.show('La fecha debe ser mayor a la de hoy');
        return;
      }
      // Mapeo de datos para el backend
      const eventoDTO = {
        titulo: nombreEvento,
        fechaHoraEvento: fecha + 'T' + hora, // formato ISO simple
        ubicacion: direccion, // mapeo correcto para el backend
        descripcion: descripcion,
        idUsuario: this.currentUserId,
        estadoEvento: 'PUBLICADO'
      };
      this.eventoService.crearEvento(eventoDTO).subscribe({
        next: () => {
          this.closeModal();
          setTimeout(() => {
            this.popupService.show('Evento publicado!');
          }, 300);
        },
        error: (err) => {
          // Extract error message from response if available
          let errorMsg = 'Error al publicar el evento';
          if (err && err.error && err.error.message) {
            errorMsg = err.error.message;
          }
          this.popupService.show(errorMsg);
        }
      });
    } else {
      this.popupService.show('Faltan campos por llenar');
    }
  }
}
