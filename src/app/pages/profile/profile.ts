import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PopupService } from '../../services/popup.service';
import { UserService, Usuario } from '../../services/user.service';
import { Carousel } from "../../components/carousel/carousel";
import { Calendar } from "../../components/calendar/calendar";
import { PopupMessageComponent } from '../../components/popup-message/popup-message';
import { CommentsComponent } from '../../components/comments/comments';
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-profile',
  standalone: true, 
  imports: [CommonModule, Carousel, Calendar, PopupMessageComponent, CommentsComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'] 
})
export class ProfileComponent implements OnInit, OnDestroy {
  perfil: Usuario | null = null;
  popupMessage: string | null = null;
  popupVisible = false;

  private popupSub?: Subscription;
  private visibleSub?: Subscription;

  usuarioActual: Usuario | null = null;
  esPerfilPropio = false;

  private routeParamsSub?: Subscription;
  private usuarioActualSub?: Subscription;

  /**
   * ID de prueba para comentar si NO hay usuario logueado.
   * 👉 PONÉ ACÁ un ID real de tu tabla Usuario para probar crear/eliminar comentarios.
   * Si lo dejás vacío, el componente mostrará el hint de login y no permitirá publicar.
   */
  testerId: string = '70b2447c-1dfb-4f53-9a61-8491ddf968d7'; // Ej.: '70b2447c-1dfb-4f53-9a61-8491ddf968d7'

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // 1) Usuario actual (si hay auth)
    this.usuarioActualSub = this.userService.getUsuarioActual().subscribe({
      next: (usuario: Usuario | null) => {
        this.usuarioActual = usuario;
        console.log('Usuario actual:', usuario);
      },
      error: (err: any) => {
        console.error('Error al obtener usuario actual:', err);
      }
    });

    // 2) Parámetro de ruta para resolver el perfil
    this.routeParamsSub = this.route.paramMap.subscribe(params => {
      const perfilId = params.get('id');

      if (perfilId) {
        // Perfil específico por URL
        this.cargarPerfilPorId(perfilId);
      } else {
        // Perfil propio si hay usuario logueado
        if (this.usuarioActual) {
          this.perfil = this.usuarioActual;
          this.esPerfilPropio = true;
        } else {
          // Datos de ejemplo si no hay login ni id en ruta
          this.perfil = { id: 'usuario-demo', emailUsuario: 'demo@example.com', nombreUsuario: 'Café Bonito' } as Usuario;
          this.esPerfilPropio = false;
        }
      }
    });

    // 3) Popups
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
        // Fallback visual si hay error
        this.perfil = { id, emailUsuario: '', nombreUsuario: 'Usuario no encontrado' } as Usuario;
        this.esPerfilPropio = false;
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
