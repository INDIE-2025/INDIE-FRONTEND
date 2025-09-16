import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private segSrv: SeguimientoService
  ) {}

  ngOnInit() {
    
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
    this.userService.getPerfilPorUsername(username).subscribe({
      next: (usuario: Usuario) => {
        this.perfil = usuario;
        this.esPerfilPropio = this.usuarioActual?.id === usuario.id;
        if (usuario.username) this.cargarEstadisticas(usuario.username);
        console.log('Perfil cargado por username:', usuario);
      },
      error: (err) => {
        console.error('Error al cargar el perfil por username:', err);
        this.perfil = { id: '', emailUsuario: '', nombreUsuario: username, username } as Usuario;
        this.esPerfilPropio = false;
        this.totalSeguidores = 0;
        this.totalSeguidos = 0;
      }
    });
  }

  private cargarEstadisticas(username: string) {
    this.segSrv.estadisticas(username).subscribe({
      next: (r) => {this.totalSeguidores = r.totalSeguidores; this.totalSeguidos = r.totalSeguidos;},
      error: () => {this.totalSeguidores = 0; this.totalSeguidos = 0;}
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

      // Si la lista está abierta, la re-montamos para forzar reload
      if (this.listaAbierta) {
        const t = this.listaAbierta;
        this.listaAbierta = null;
        setTimeout(() => this.listaAbierta = t, 0);
      }
    }
  }

  ngOnDestroy() {
    this.popupSub?.unsubscribe();
    this.visibleSub?.unsubscribe();
    this.routeParamsSub?.unsubscribe();
    this.usuarioActualSub?.unsubscribe();
  }
}
