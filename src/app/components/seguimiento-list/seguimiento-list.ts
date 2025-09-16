import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguimientoService, UsuarioBasico } from '../../services/seguimiento.service';
import { Observable } from 'rxjs';


@Component({
selector: 'app-seguimiento-list',
standalone: true,
imports: [CommonModule],
templateUrl: './seguimiento-list.html',
styleUrls: ['./seguimiento-list.scss'],
})

export class SeguimientoListComponent implements OnChanges {
/** username del perfil que estoy viendo */
  @Input() username!: string;
  @Input() tipo!: 'seguidores'|'seguidos';
  @Input() esPerfilPropio: boolean = false; // Nueva propiedad para saber si es el perfil propio
  @Output() close = new EventEmitter<void>();
  @Output() changed = new EventEmitter<'unfollow' | 'block'>();


usuarios: UsuarioBasico[] = [];
total = 0;
loading = false;
errorMsg = '';


constructor(private segSrv: SeguimientoService) {}


ngOnChanges(): void { this.cargar(); }


private cargar() {
  this.loading = true; this.errorMsg = ''; this.usuarios = []; this.total = 0;


  const obs$: Observable<any> = this.tipo === 'seguidores'
  ? this.segSrv.seguidoresDe(this.username)
  : this.segSrv.seguidosDe(this.username);


  obs$.subscribe({
    next: (r: any) => {
      if (this.tipo === 'seguidores') { this.usuarios = r.seguidores || []; this.total = r.totalSeguidores || 0; }
      else { this.usuarios = r.seguidos || []; this.total = r.totalSeguidos || 0; }
      this.loading = false;
    },
    error: (e) => { this.errorMsg = e?.error?.error || 'No se pudo cargar la lista'; this.loading = false; }
    });
  }


  // Métodos disponibles cuando es el perfil propio
  dejarDeSeguir(u: UsuarioBasico) {
    const username = u.username || '';
    if (!username) { this.errorMsg = 'No se encontró el username'; return; }

    this.errorMsg = '';
    this.segSrv.dejarDeSeguir(username).subscribe({
      next: () => {this.cargar(); this.changed.emit('unfollow');},
      error: (e) => this.errorMsg = e?.error?.error || 'No se pudo dejar de seguir'
    });
  }

  bloquear(u: UsuarioBasico) {
    const username = u.username || '';
    if (!username) { this.errorMsg = 'No se encontró el username'; return; }

    this.errorMsg = '';
    this.segSrv.bloquear(username).subscribe({
      next: () => {this.cargar(); this.changed.emit('block');},
      error: (e) => this.errorMsg = e?.error?.error || 'No se pudo bloquear'
    });
  }
}