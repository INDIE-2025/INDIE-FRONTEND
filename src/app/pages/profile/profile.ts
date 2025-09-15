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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Carousel, Calendar, Galleria, PopupMessageComponent, CommentsComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  
  perfil: Usuario | null = null;
  usuarioActual: Usuario | null = null;
  esPerfilPropio = false;

  
  popupMessage: string | null = null;
  popupVisible = false;

  
  private popupSub?: Subscription;
  private visibleSub?: Subscription;
  private routeParamsSub?: Subscription;
  private usuarioActualSub?: Subscription;

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private route: ActivatedRoute
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
        console.log('Perfil cargado por username:', usuario);
      },
      error: (err) => {
        console.error('Error al cargar el perfil por username:', err);
        
        this.perfil = { id: '', emailUsuario: '', nombreUsuario: username } as Usuario;
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
