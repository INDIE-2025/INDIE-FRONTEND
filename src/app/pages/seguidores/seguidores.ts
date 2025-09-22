import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeguimientoService, UsuarioBasico, VerificacionSeguimiento } from '../../services/seguimiento.service';
import { UserService } from '../../services/user.service';
import { Usuario } from '../../core/models/usuario.model';
import Swal from 'sweetalert2';

interface SeguidorExtendido extends UsuarioBasico {
  sigueDeVuelta?: boolean; // Si yo también lo sigo
  verificando?: boolean;
  cargando?: boolean;
}

@Component({
  selector: 'app-seguidores',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seguidores.html',
  styleUrl: './seguidores.scss'
})
export class SeguidoresComponent implements OnInit {
  seguidores: SeguidorExtendido[] = [];
  loading = true;
  searchTerm = '';
  filteredSeguidores: SeguidorExtendido[] = [];
  errorMsg = '';
  currentUsername = '';

  constructor(
    private seguimientoService: SeguimientoService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Obtener username del usuario actual
    this.userService.getUsuarioActual().subscribe((user: Usuario | null) => {
      if (user?.username) {
        this.currentUsername = user.username;
        this.cargarSeguidores();
      }
    });
  }

  cargarSeguidores(): void {
    this.loading = true;
    this.errorMsg = '';

    this.seguimientoService.seguidoresDe(this.currentUsername).subscribe({
      next: (response) => {
        this.seguidores = response.seguidores.map(seguidor => ({
          ...seguidor,
          sigueDeVuelta: false,
          verificando: true,
          cargando: false
        }));

        // Verificar si cada seguidor también es seguido por mí
        this.verificarSeguimientoMutuo();
        
        this.filteredSeguidores = [...this.seguidores];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar seguidores:', error);
        this.errorMsg = 'Error al cargar la lista de seguidores';
        this.loading = false;
      }
    });
  }

  verificarSeguimientoMutuo(): void {
    this.seguidores.forEach(seguidor => {
      if (seguidor.username) {
        this.seguimientoService.verificar(seguidor.username).subscribe({
          next: (verificacion: VerificacionSeguimiento) => {
            seguidor.sigueDeVuelta = verificacion.sigue;
            seguidor.verificando = false;
          },
          error: () => {
            seguidor.verificando = false;
          }
        });
      }
    });
  }

  search(event: any): void {
    const value = event.target.value.toLowerCase();
    this.searchTerm = value;
    
    if (!value) {
      this.filteredSeguidores = [...this.seguidores];
      return;
    }
    
    this.filteredSeguidores = this.seguidores.filter(seguidor => 
      seguidor.nombreUsuario?.toLowerCase().includes(value) || 
      seguidor.apellidoUsuario?.toLowerCase().includes(value) ||
      seguidor.username?.toLowerCase().includes(value) ||
      seguidor.emailUsuario?.toLowerCase().includes(value)
    );
  }

  // Para usuarios que me siguen pero yo no los sigo
  seguir(seguidor: SeguidorExtendido): void {
    if (!seguidor.username || seguidor.cargando) return;

    seguidor.cargando = true;
    this.seguimientoService.seguir(seguidor.username).subscribe({
      next: () => {
        seguidor.sigueDeVuelta = true;
        seguidor.cargando = false;
      },
      error: (error) => {
        console.error('Error al seguir usuario:', error);
        this.errorMsg = 'Error al seguir al usuario';
        seguidor.cargando = false;
      }
    });
  }

  // Para usuarios que son mutuos (me siguen y yo los sigo)
  async dejarDeSeguir(seguidor: SeguidorExtendido): Promise<void> {
    if (!seguidor.username || seguidor.cargando) return;

    // Confirmación con SweetAlert
    const { isConfirmed } = await Swal.fire({
      title: '¿Dejar de seguir?',
      text: `¿Estás seguro de que quieres dejar de seguir a ${seguidor.username}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, dejar de seguir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    });

    if (!isConfirmed) return;

    seguidor.cargando = true;
    this.seguimientoService.dejarDeSeguir(seguidor.username).subscribe({
      next: () => {
        seguidor.sigueDeVuelta = false;
        seguidor.cargando = false;
      },
      error: (error) => {
        console.error('Error al dejar de seguir usuario:', error);
        this.errorMsg = 'Error al dejar de seguir al usuario';
        seguidor.cargando = false;
      }
    });
  }

  // Para bloquear cualquier seguidor
  async bloquear(seguidor: SeguidorExtendido): Promise<void> {
    if (!seguidor.username || seguidor.cargando) return;

    // Confirmación con SweetAlert
    const { isConfirmed } = await Swal.fire({
      title: '¿Bloquear usuario?',
      text: `¿Estás seguro de que quieres bloquear a ${seguidor.username}? Esta acción impedirá que puedan interactuar contigo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, bloquear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    });

    if (!isConfirmed) return;

    seguidor.cargando = true;
    this.seguimientoService.bloquear(seguidor.username).subscribe({
      next: () => {
        // Remover de la lista después de bloquear
        this.seguidores = this.seguidores.filter(s => s.id !== seguidor.id);
        this.filteredSeguidores = this.filteredSeguidores.filter(s => s.id !== seguidor.id);
      },
      error: (error) => {
        console.error('Error al bloquear usuario:', error);
        this.errorMsg = 'Error al bloquear al usuario';
        seguidor.cargando = false;
      }
    });
  }
}