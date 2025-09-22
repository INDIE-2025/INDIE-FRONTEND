import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguimientoService } from '../../services/seguimiento.service';
import Swal from 'sweetalert2';


@Component({
selector: 'app-follow-button',
standalone: true,
imports: [CommonModule],
templateUrl: './follow-button.html',
styleUrls: ['./follow-button.scss'],
})
export class FollowButtonComponent implements OnInit {
/** username del perfil que estoy viendo */
  @Input() perfilUsername!: string;
  @Output() changed = new EventEmitter<'follow' | 'unfollow' | 'block' | 'unblock'>();

  estado: 'siguiendo' | 'no-siguiendo' | 'bloqueado' | 'cargando' = 'cargando';
  cargando = false;
  errorMsg = '';


  constructor(private segSrv: SeguimientoService) {}


  ngOnInit() { this.refrescar(); }


  private refrescar() {
  this.cargando = true;
  this.segSrv.verificar(this.perfilUsername).subscribe({
    next: (v) => {
      this.estado = v.bloqueado ? 'bloqueado' : (v.sigue ? 'siguiendo' : 'no-siguiendo');
      this.cargando = false;
    },
    error: (e) => { this.estado = 'no-siguiendo'; this.cargando = false; this.errorMsg = e?.error?.error || ''; }
  });
  }


  onSeguir() {
    this.cargando = true; this.errorMsg = '';
    this.segSrv.seguir(this.perfilUsername).subscribe({
      next: () => { 
        this.cargando = false; 
        this.refrescar(); 
        this.changed.emit('follow');
      },
      error: (e) => { 
        this.cargando = false; 
        this.errorMsg = e?.error?.error || 'No se pudo seguir'; 
      }
    });
  }


  async onDejarDeSeguir() {
    // Confirmación con SweetAlert
    const { isConfirmed } = await Swal.fire({
      title: '¿Dejar de seguir?',
      text: `¿Estás seguro de que quieres dejar de seguir a ${this.perfilUsername}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, dejar de seguir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    });

    if (!isConfirmed) return;

    this.cargando = true; 
    this.errorMsg = '';
    this.segSrv.dejarDeSeguir(this.perfilUsername).subscribe({
      next: () => { this.cargando = false; this.refrescar(); this.changed.emit('unfollow');},
      error: (e) => { this.cargando = false; this.errorMsg = e?.error?.error || 'No se pudo dejar de seguir'; }
    });
  }

  async onDesbloquear() {
    // Confirmación con SweetAlert
    const { isConfirmed } = await Swal.fire({
      title: '¿Desbloquear usuario?',
      text: `¿Estás seguro de que quieres desbloquear a ${this.perfilUsername}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, desbloquear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745'
    });

    if (!isConfirmed) return;

    this.cargando = true; this.errorMsg = '';
    this.segSrv.desbloquear(this.perfilUsername).subscribe({
      next: () => { this.cargando = false; this.refrescar(); this.changed.emit('unblock');},
      error: (e) => { this.cargando = false; this.errorMsg = e?.error?.error || 'No se pudo desbloquear'; }
    });
  }
}