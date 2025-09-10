import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PopupService } from '../../services/popup.service';
import { UserService, Usuario } from '../../services/user.service';
import { Carousel } from "../../components/carousel/carousel";
import { Calendar } from "../../components/calendar/calendar";
import { Galleria } from "../../components/galleria/galleria";
import { PopupMessageComponent } from '../../components/popup-message/popup-message';
import { CommentsComponent } from '../../components/comments/comments';


@Component({
  selector: 'app-profile',
  imports: [Carousel, Calendar, Galleria, PopupMessageComponent, CommentsComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  perfil: Usuario | null = null;
  popupMessage: string | null = null;
  popupVisible: boolean = false;
  private popupSub?: Subscription;
  private visibleSub?: Subscription;
  usuarioActual: Usuario | null = null;
  esPerfilPropio: boolean = false;
  
  private routeParamsSub?: Subscription;
  private usuarioActualSub?: Subscription;

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Suscribirse al usuario actual
    this.usuarioActualSub = this.userService.getUsuarioActual().subscribe({
      next: (usuario: Usuario | null) => {
        this.usuarioActual = usuario;
        console.log('Usuario actual:', usuario);
      },
      error: (err: any) => {
        console.error('Error al obtener usuario actual:', err);
      }
    });

    // Suscribirse a los parámetros de la ruta para obtener el ID del perfil
    this.routeParamsSub = this.route.paramMap.subscribe(params => {
      const perfilId = params.get('id');
      
      if (perfilId) {
        // Si hay ID en la URL, cargar ese perfil específico
        this.cargarPerfilPorId(perfilId);
      } else {
        // Si no hay ID, mostrar el perfil del usuario actual
        if (this.usuarioActual) {
          this.perfil = this.usuarioActual;
          this.esPerfilPropio = true;
        } else {
          // Si no hay usuario logueado, usar datos de ejemplo
          this.perfil = { id: 'usuario-demo', emailUsuario: 'demo@example.com', nombreUsuario: 'Café Bonito' } as Usuario;
        }
      }
    });
    
    this.popupSub = this.popupService.message$.subscribe(msg => this.popupMessage = msg);
    this.visibleSub = this.popupService.visible$.subscribe(v => this.popupVisible = v);
  }

  private cargarPerfilPorId(id: string): void {
    this.userService.getPerfilPorId(id).subscribe({
      next: (usuario: Usuario) => {
        this.perfil = usuario;
        this.esPerfilPropio = this.usuarioActual?.id === usuario.id;
        console.log('Perfil cargado:', usuario);
      },
      error: (err: any) => {
        console.error('Error al cargar el perfil:', err);
        // Datos de ejemplo si hay error
        this.perfil = { id: id, emailUsuario: '', nombreUsuario: 'Usuario no encontrado' } as Usuario;
      }
    });
  }

  ngOnDestroy() {
    this.popupSub?.unsubscribe();
    this.visibleSub?.unsubscribe();
    this.routeParamsSub?.unsubscribe();
    this.usuarioActualSub?.unsubscribe();
  }
}
