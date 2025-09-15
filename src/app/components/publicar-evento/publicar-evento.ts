  
import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopupMessageComponent } from '../popup-message/popup-message';
import { PopupService } from '../../services/popup.service';
import { EventoService } from '../../services/evento.service';
import { CdkAutofill } from "@angular/cdk/text-field";

@Component({
  selector: 'app-publicar-evento',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PopupMessageComponent],
  templateUrl: './publicar-evento.html',
  styleUrl: './publicar-evento.scss'
})

export class PublicarEvento {
  borradores: any[] = [];
  borradorSeleccionado: any = null;
  
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



  constructor(private popupService: PopupService, private eventoService: EventoService) {
    // Cargar borradores al iniciar el componente
    this.eventoService.getBorradoresPorUsuario('a58aa88e-3110-477c-b6d8-bbca3d94ebfd').subscribe({
      next: (data) => this.borradores = data,
      //error: () => this.popupService.show('No se pudieron cargar los borradores')
    });
  }

  private dialogRef = inject(DialogRef, {optional: true});
  protected closeModal() {
    this.dialogRef?.close();
  }

  guardarComoBorrador() {
    const form = this.applyForm.value;
    const eventoDTO = {
      titulo: form.nombreEvento,
      fechaHoraEvento: (form.fecha && form.hora) ? form.fecha + 'T' + form.hora : null,
      ubicacion: form.direccion ? form.direccion : null,
      descripcion: form.descripcion ? form.descripcion : null,
      idUsuario: 'a58aa88e-3110-477c-b6d8-bbca3d94ebfd',
      estadoEvento: 'BORRADOR'
    };
    this.eventoService.guardarBorrador(eventoDTO).subscribe({
      next: () => {
        this.popupService.show('Borrador guardado!');
        // Refresh the drafts list
        this.eventoService.getBorradoresPorUsuario('a58aa88e-3110-477c-b6d8-bbca3d94ebfd').subscribe({
          next: (data) => this.borradores = data,
          error: () => {} // Silently fail if we can't refresh
        });
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
        idUsuario: 'a58aa88e-3110-477c-b6d8-bbca3d94ebfd',
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
