import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import {Dialog} from '@angular/cdk/dialog';
import { PublicarEvento } from '../publicar-evento/publicar-evento';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dropdown',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss'
})
export class Dropdown {
  private dialog = inject(Dialog);
  private router = inject(Router);
  private auth = inject(AuthService);
  protected openModal(){
    this.dialog.open(PublicarEvento, {disableClose: true});
  }
  protected logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
