import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeguimientoService, UsuarioBasico } from '../../services/seguimiento.service';
import Swal from 'sweetalert2';

interface UsuarioBloqueadoExtendido extends UsuarioBasico {
  cargando?: boolean;
}

@Component({
  selector: 'app-usuarios-bloqueados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuarios-bloqueados.html',
  styleUrl: './usuarios-bloqueados.scss'
})
export class UsuariosBloqueadosComponent implements OnInit {
  usuariosBloqueados: UsuarioBloqueadoExtendido[] = [];
  loading = true;
  searchTerm = '';
  filteredUsuarios: UsuarioBloqueadoExtendido[] = [];
  errorMsg = '';

  constructor(private seguimientoService: SeguimientoService) {}

  ngOnInit(): void {
    this.cargarUsuariosBloqueados();
  }

  cargarUsuariosBloqueados(): void {
    this.loading = true;
    this.errorMsg = '';

    this.seguimientoService.usuariosBloqueados().subscribe({
      next: (response) => {
        // Usar la estructura correcta de la respuesta
        const usuariosArray = response.usuariosBloqueados || [];
        
        this.usuariosBloqueados = usuariosArray.map((usuario: any) => ({
          ...usuario,
          cargando: false
        }));
        
        this.filteredUsuarios = [...this.usuariosBloqueados];
        this.loading = false;
      },
      error: (error) => {
        // Crear mensaje de error más específico
        let errorMessage = 'Error al cargar la lista de usuarios bloqueados';
        if (error.status === 0) {
          errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.';
        } else if (error.status === 404) {
          errorMessage = 'El endpoint de usuarios bloqueados no está implementado en el backend.';
        } else if (error.status === 403) {
          errorMessage = 'No tienes permisos para acceder a usuarios bloqueados.';
        } else if (error.status === 401) {
          errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
        }
        
        this.errorMsg = errorMessage;
        this.loading = false;
      }
    });
  }

  search(event: any): void {
    const value = event.target.value.toLowerCase();
    this.searchTerm = value;
    
    if (!value) {
      this.filteredUsuarios = [...this.usuariosBloqueados];
      return;
    }
    
    this.filteredUsuarios = this.usuariosBloqueados.filter(usuario => 
      usuario.nombreUsuario?.toLowerCase().includes(value) || 
      usuario.apellidoUsuario?.toLowerCase().includes(value) ||
      usuario.username?.toLowerCase().includes(value) ||
      usuario.emailUsuario?.toLowerCase().includes(value)
    );
  }

  async desbloquear(usuario: UsuarioBloqueadoExtendido): Promise<void> {
    if (!usuario.username || usuario.cargando) return;

    // Confirmación con SweetAlert
    const { isConfirmed } = await Swal.fire({
      title: '¿Desbloquear usuario?',
      text: `¿Estás seguro de que quieres desbloquear a ${usuario.username}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, desbloquear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745'
    });

    if (!isConfirmed) return;

    usuario.cargando = true;
    this.seguimientoService.desbloquear(usuario.username).subscribe({
      next: () => {
        // Remover de la lista después de desbloquear
        this.usuariosBloqueados = this.usuariosBloqueados.filter(u => u.id !== usuario.id);
        this.filteredUsuarios = this.filteredUsuarios.filter(u => u.id !== usuario.id);
        this.errorMsg = ''; // Limpiar mensajes de error
      },
      error: (error) => {
        this.errorMsg = 'Error al desbloquear al usuario';
        usuario.cargando = false;
      }
    });
  }
}