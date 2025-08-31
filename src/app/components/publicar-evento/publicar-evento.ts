import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopupMessageComponent } from '../popup-message/popup-message';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-publicar-evento',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PopupMessageComponent],
  templateUrl: './publicar-evento.html',
  styleUrl: './publicar-evento.scss'
})

export class PublicarEvento {


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



  constructor(private popupService: PopupService) {}

  private dialogRef = inject(DialogRef, {optional: true});
  protected closeModal() {
    this.dialogRef?.close();
  }


  // El popup ahora es global, no local


  submitApplication() {
    const { nombreEvento, hora, fecha, direccion, descripcion } = this.applyForm.value;
    if (
      nombreEvento && nombreEvento.trim() !== '' &&
      hora && hora.trim() !== '' &&
      fecha && fecha.trim() !== '' &&
      direccion && direccion.trim() !== '' &&
      descripcion && descripcion.trim() !== ''
    ) {
      this.closeModal();
      setTimeout(() => {
        this.popupService.show('Evento publicado!');
      }, 300);
    } else {
  this.popupService.show('Faltan campos por llenar');
    }
  }
}
