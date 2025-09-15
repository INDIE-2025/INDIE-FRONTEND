import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-datos-personales',
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './datos-personales.html',
  styleUrl: './datos-personales.scss',
  standalone: true
})
export class DatosPersonales {
  popupMessage: string = '';
  popupVisible: boolean = false;

  

  constructor(private popupService: PopupService) {}

  private dialogRef = inject(DialogRef, {optional: true});
  protected closeModal() {
    this.dialogRef?.close();
  }


}
