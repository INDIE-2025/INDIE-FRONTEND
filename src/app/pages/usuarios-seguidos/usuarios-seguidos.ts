import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeguimientoService, UsuarioBasico } from '../../services/seguimiento.service';
import { UserService } from '../../services/user.service';
import { Usuario } from '../../core/models/usuario.model';
import Swal from 'sweetalert2';

interface UsuarioSeguidoExtendido extends UsuarioBasico {
  cargando?: boolean;
}

@Component({
  selector: 'app-usuarios-seguidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuarios-seguidos.html',
  styleUrl: './usuarios-seguidos.scss'
})
export class UsuariosSeguidos implements OnInit {
  usuariosSeguidos: UsuarioSeguidoExtendido[] = [];
  loading = true;
  searchTerm = '';
  filteredUsuarios: UsuarioSeguidoExtendido[] = [];
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
        this.cargarUsuariosSeguidos();
      }
    });
  }

  cargarUsuariosSeguidos(): void {
    this.loading = true;
    this.errorMsg = '';

    this.seguimientoService.seguidosDe(this.currentUsername).subscribe({
      next: (response) => {
        this.usuariosSeguidos = response.seguidos.map(usuario => ({
          ...usuario,
          cargando: false
        }));
        
        this.filteredUsuarios = [...this.usuariosSeguidos];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios seguidos:', error);
        this.errorMsg = 'Error al cargar la lista de usuarios seguidos';
        this.loading = false;
      }
    });
  }

  search(event: any): void {
    const value = event.target.value.toLowerCase();
    this.searchTerm = value;
    
    if (!value) {
      this.filteredUsuarios = [...this.usuariosSeguidos];
      return;
    }
    
    this.filteredUsuarios = this.usuariosSeguidos.filter(usuario => 
      usuario.nombreUsuario?.toLowerCase().includes(value) || 
      usuario.apellidoUsuario?.toLowerCase().includes(value) ||
      usuario.username?.toLowerCase().includes(value) ||
      usuario.emailUsuario?.toLowerCase().includes(value)
    );
  }

  async dejarDeSeguir(usuario: UsuarioSeguidoExtendido): Promise<void> {
    if (!usuario.username || usuario.cargando) return;

    // Confirmación con SweetAlert
    const { isConfirmed } = await Swal.fire({
      title: '¿Dejar de seguir?',
      text: `¿Estás seguro de que quieres dejar de seguir a ${usuario.username}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, dejar de seguir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    });

    if (!isConfirmed) return;

    usuario.cargando = true;
    this.seguimientoService.dejarDeSeguir(usuario.username).subscribe({
      next: () => {
        // Remover de la lista después de dejar de seguir
        this.usuariosSeguidos = this.usuariosSeguidos.filter(u => u.id !== usuario.id);
        this.filteredUsuarios = this.filteredUsuarios.filter(u => u.id !== usuario.id);
        this.errorMsg = ''; // Limpiar mensajes de error
      },
      error: (error) => {
        console.error('Error al dejar de seguir usuario:', error);
        this.errorMsg = 'Error al dejar de seguir al usuario';
        usuario.cargando = false;
      }
    });
  }

  async bloquear(usuario: UsuarioSeguidoExtendido): Promise<void> {
    if (!usuario.username || usuario.cargando) return;

    // Confirmación con SweetAlert
    const { isConfirmed } = await Swal.fire({
      title: '¿Bloquear usuario?',
      text: `¿Estás seguro de que quieres bloquear a ${usuario.username}? Esta acción impedirá que puedan interactuar contigo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, bloquear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    });

    if (!isConfirmed) return;

    usuario.cargando = true;
    this.seguimientoService.bloquear(usuario.username).subscribe({
      next: () => {
        // Remover de la lista después de bloquear
        this.usuariosSeguidos = this.usuariosSeguidos.filter(u => u.id !== usuario.id);
        this.filteredUsuarios = this.filteredUsuarios.filter(u => u.id !== usuario.id);
        this.errorMsg = ''; // Limpiar mensajes de error
      },
      error: (error) => {
        console.error('Error al bloquear usuario:', error);
        this.errorMsg = 'Error al bloquear al usuario';
        usuario.cargando = false;
      }
    });
  }
}