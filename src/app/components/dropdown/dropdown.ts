import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import {Dialog} from '@angular/cdk/dialog';
import { PublicarEvento } from '../publicar-evento/publicar-evento';

@Component({
  selector: 'app-dropdown',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss'
})
export class Dropdown {
  private dialog = inject(Dialog);
  protected openModal(){
    this.dialog.open(PublicarEvento, {disableClose: true});
  }

}
