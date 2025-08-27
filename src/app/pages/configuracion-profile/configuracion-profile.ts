import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-configuracion-profile',
  imports: [ RouterOutlet, RouterModule ],
  standalone: true,
  templateUrl: './configuracion-profile.html',
  styleUrl: './configuracion-profile.scss'
})
export class ConfiguracionProfile {

}
