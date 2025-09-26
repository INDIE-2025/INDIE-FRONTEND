import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PopupService } from '../../services/popup.service';
import { UserService } from '../../services/user.service';
import { Usuario } from '../../core/models/usuario.model';
import { Carousel } from "../../components/carousel/carousel";
import { Calendar } from "../../components/calendar/calendar";
import { Galleria } from "../../components/galleria/galleria";
import { PopupMessageComponent } from '../../components/popup-message/popup-message';
import { CommentsComponent } from '../../components/comments/comments';
import { CommonModule } from '@angular/common';
import { SeguimientoService } from '../../services/seguimiento.service';
import { FollowButtonComponent } from "../../components/follow-button/follow-button";
import { SeguimientoListComponent } from '../../components/seguimiento-list/seguimiento-list';
import Swal from 'sweetalert2';
import { ChatApiService } from '../../core/services/chat-api.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Carousel, Calendar, Galleria, PopupMessageComponent, CommentsComponent, FollowButtonComponent, SeguimientoListComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  
  perfil: Usuario | null = null;
  usuarioActual: Usuario | null = null;
  esPerfilPropio = false;

  totalSeguidores = 0;
  totalSeguidos = 0;
  listaAbierta: null | 'seguidores' | 'seguidos' = null;  

  // Estados de bloqueo
  perfilBloqueado = false;
  bloqueoMutuo = false;
  cargandoPerfil = false;
  errorPerfil = '';
  
  // Menú de opciones
  showOptionsMenu = false;
  seguimientoData: any = null;
  
  popupMessage: string | null = null;
  popupVisible = false;

  
  private popupSub?: Subscription;
  private visibleSub?: Subscription;
  private routeParamsSub?: Subscription;
  private usuarioActualSub?: Subscription;

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private route: ActivatedRoute,
    private segSrv: SeguimientoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private chatApi: ChatApiService
  ) {}

  // Listener para cerrar menú al hacer clic fuera
  private documentClickListener = (event: Event) => {
    const target = event.target as HTMLElement;
    const optionsMenu = target.closest('.options-menu');
    
    // Si el clic fue dentro del menú de opciones, no hacer nada
    if (optionsMenu) return;
    
    // Si el menú está abierto y el clic fue fuera, cerrarlo
    if (this.showOptionsMenu) {
      this.showOptionsMenu = false;
    }
  };

  ngOnInit() {
    // Listener para cerrar menú al hacer clic fuera
    document.addEventListener('click', this.documentClickListener);
    
    this.usuarioActualSub = this.userService.getUsuarioActual().subscribe({
      next: (usuario: Usuario | null) => {
        this.usuarioActual = usuario;
        
        if (this.perfil && usuario) {
          this.esPerfilPropio = this.perfil.id === usuario.id;
        }
      },
      error: (err) => console.error('Error al obtener usuario actual:', err)
    });

    
    this.routeParamsSub = this.route.paramMap.subscribe(params => {
      const username = params.get('username');

      if (username) {
        this.cargarPerfilPorUsername(username);
      } else {
        
        if (this.usuarioActual) {
          this.perfil = this.usuarioActual;
          this.esPerfilPropio = true;
          if (this.perfil.username) this.cargarEstadisticas(this.perfil.username);
        } else {
          this.perfil = {
            id: 'usuario-demo',
            emailUsuario: 'demo@example.com',
            nombreUsuario: 'Usuario Demo'
          } as Usuario;
          this.esPerfilPropio = false;
        }
      }
    });

   
    this.popupSub = this.popupService.message$.subscribe(msg => this.popupMessage = msg);
    this.visibleSub = this.popupService.visible$.subscribe(v => this.popupVisible = v);
  }

  private cargarPerfilPorUsername(username: string): void {
    this.cargandoPerfil = true;
    this.errorPerfil = '';
    this.perfilBloqueado = false;
    this.bloqueoMutuo = false;

    // Primero verificar si YO bloqueé al usuario
    this.segSrv.usuariosBloqueados().subscribe({
      next: (response) => {
        const usuariosBloqueados = response.usuariosBloqueados || [];
        const yoBloqueeAlUsuario = usuariosBloqueados.some(usuario => 
          usuario.username === username || usuario.emailUsuario === username
        );

        if (yoBloqueeAlUsuario) {
          // YO bloqueé al usuario - no mostrar perfil
          this.perfilBloqueado = true;
          this.perfil = null;
          this.cargandoPerfil = false;
          this.errorPerfil = 'No puedes ver este perfil porque lo has bloqueado.';
        } else {
          // YO no lo bloqueé - intentar cargar perfil (el backend verificará si me bloqueó)
          this.intentarCargarPerfil(username);
        }
      },
      error: (err) => {
        console.warn('Error al verificar mis bloqueos, continuando con carga:', err);
        this.intentarCargarPerfil(username);
      }
    });
  }

  private intentarCargarPerfil(username: string): void {
    // El backend ahora maneja automáticamente la verificación de si fui bloqueado
    this.userService.getPerfilPorUsername(username).subscribe({
      next: (usuario) => {
        // Perfil cargado exitosamente - no hay bloqueos
        this.perfil = usuario;
        this.esPerfilPropio = this.usuarioActual?.id === usuario.id;
        this.cargandoPerfil = false;
        if (usuario.username) {
          this.cargarEstadisticas(usuario.username);
          this.cargarEstadoSeguimiento(usuario.username);
        }
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.cargandoPerfil = false;
        
        // El backend ahora maneja automáticamente la verificación de bloqueo
        if (err.status === 403) {
          // Error 403 significa que fui bloqueado por el usuario
          this.perfilBloqueado = true;
          this.errorPerfil = err.error?.bloqueado 
            ? 'No puedes ver este perfil porque el usuario te bloqueó.'
            : 'No tienes permisos para ver este perfil.';
        } else if (err.status === 404) {
          this.errorPerfil = 'El usuario no existe o no fue encontrado.';
        } else if (err.status === 401) {
          this.errorPerfil = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
        } else {
          this.errorPerfil = 'Error al cargar el perfil del usuario.';
        }
        
        // Mantener información básica para mostrar error apropiado
        this.perfil = null;
        this.esPerfilPropio = false;
        this.totalSeguidores = 0;
        this.totalSeguidos = 0;
      }
    });
  }

  private cargarDatosDelPerfil(username: string): void {
    // Método legacy - redirige al método principal
    this.intentarCargarPerfil(username);
  }

  private cargarEstadisticas(username: string) {
    this.segSrv.estadisticas(username).subscribe({
      next: (r) => {
        this.totalSeguidores = r.totalSeguidores; 
        this.totalSeguidos = r.totalSeguidos;
      },
      error: (err) => {
        // El backend ahora puede devolver 403 si estoy bloqueado
        if (err.status === 403 && err.error?.bloqueado) {
          // Si me bloquearon, las estadísticas no están disponibles
          this.totalSeguidores = 0; 
          this.totalSeguidos = 0;
          console.warn('Estadísticas no disponibles - usuario bloqueado');
        } else {
          // Otros errores - usar valores por defecto
          this.totalSeguidores = 0; 
          this.totalSeguidos = 0;
        }
      }
    });
  }

  private cargarEstadoSeguimiento(username: string) {
    this.segSrv.verificar(username).subscribe({
      next: (estado) => {
        this.seguimientoData = estado;
      },
      error: (err) => {
        console.warn('Error al verificar estado de seguimiento:', err);
        this.seguimientoData = null;
      }
    });
  }

  abrirLista(tipo: 'seguidores' | 'seguidos') {
    const cant = (tipo === 'seguidores') ? this.totalSeguidores : this.totalSeguidos;
    if (cant > 0 && this.perfil?.username) {
      this.listaAbierta = tipo;
    }
  }

  cerrarLista() {
    this.listaAbierta = null;
  }

  onRelacionChange(_: 'follow' | 'unfollow' | 'block' | 'unblock') {
    if (this.perfil?.username) {
      this.cargarEstadisticas(this.perfil.username);
      this.cargarEstadoSeguimiento(this.perfil.username);

      // Si la lista está abierta, la re-montamos para forzar reload
      if (this.listaAbierta) {
        const t = this.listaAbierta;
        this.listaAbierta = null;
        setTimeout(() => this.listaAbierta = t, 0);
      }
    }
  }

  volverAtras(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/home']);
    }
  }

  iniciarChat(): void {
    const otherId = this.perfil?.id;
    if (!otherId) return;
    this.chatApi.getOrCreateDirectChat(otherId).subscribe({
      next: (chat) => {
        this.router.navigate(['/chat'], { queryParams: { open: chat.id } });
      },
      error: (e) => {
        console.error('No se pudo iniciar chat', e);
      }
    });
  }

  reintentar(): void {
    const currentUsername = this.route.snapshot.paramMap.get('username');
    if (currentUsername) {
      this.cargarPerfilPorUsername(currentUsername);
    }
  }

  toggleOptionsMenu(): void {
    this.showOptionsMenu = !this.showOptionsMenu;
  }

  async onBloquear(username: string): Promise<void> {
    // Cerrar el menú de opciones antes de mostrar la confirmación
    this.showOptionsMenu = false;
    
    // Confirmación con SweetAlert
    const { isConfirmed } = await Swal.fire({
      title: '¿Bloquear usuario?',
      text: `¿Estás seguro de que quieres bloquear a ${username}? Esta acción impedirá que puedan interactuar contigo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, bloquear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    });

    if (!isConfirmed) return;

    this.segSrv.bloquear(username).subscribe({
      next: () => {
        this.popupService.show('Usuario bloqueado correctamente');
        // Recargar el perfil para actualizar el estado
        this.cargarPerfilPorUsername(username);
      },
      error: (e) => {
        this.popupService.show(e?.error?.error || 'No se pudo bloquear al usuario');
      }
    });
  }

  ngOnDestroy() {
    // Remover listener del documento
    document.removeEventListener('click', this.documentClickListener);
    
    this.popupSub?.unsubscribe();
    this.visibleSub?.unsubscribe();
    this.routeParamsSub?.unsubscribe();
    this.usuarioActualSub?.unsubscribe();
  }
}
