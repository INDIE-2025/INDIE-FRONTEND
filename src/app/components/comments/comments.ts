import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommentsService, ComentarioDTO } from '../../services/commentsService';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.html',
  styleUrls: ['./comments.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})

export class CommentsComponent implements OnInit {
  @Input() idUsuarioComentado?: string;

  comentarios: ComentarioDTO[] = [];
  loadingList = false;
  posting = false;
  errorMsg: string | null = null;

  usuarioActualId?: string; // para mostrar form y botón eliminar
  form: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private commentsSrv: CommentsService,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      comentario: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    this.userService.getUsuarioActual().subscribe(u => this.usuarioActualId = u?.id || undefined);

    if (!this.idUsuarioComentado) return;
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    if (!this.idUsuarioComentado) return;
    this.loadingList = true;
    this.commentsSrv.traerComentariosDeUnUsuario(this.idUsuarioComentado).subscribe({
      next: (data) => {
        this.comentarios = [...data].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loadingList = false;
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar los comentarios.';
        this.loadingList = false;
      },
    });
  }

  get f() { return this.form.controls; }

  enviar(): void {
    if (!this.usuarioActualId) { this.errorMsg = 'Debe iniciar sesión para comentar.'; return; }
    if (!this.idUsuarioComentado) { this.errorMsg = 'Falta el usuario destino.'; return; }
    if (this.form.invalid) { this.errorMsg = 'Corregí los errores del formulario.'; return; }

    const comentario = (this.f['comentario'].value || '').trim();
    if (!comentario) { this.errorMsg = 'El comentario no puede estar vacío.'; return; }

    this.posting = true; this.errorMsg = null;
    this.commentsSrv.realizarComentario(comentario, this.idUsuarioComentado).subscribe({
      next: () => { this.form.reset(); this.posting = false; this.cargarComentarios(); },
      error: () => { this.posting = false; this.errorMsg = 'No se pudo publicar el comentario.'; },
    });
  }

  puedeEliminar(c: ComentarioDTO): boolean {
    return !!this.usuarioActualId && c.idUsuarioComentador === this.usuarioActualId;
  }

  async eliminar(c: ComentarioDTO): Promise<void> {
    if (!c.idComentario) return;
    const { isConfirmed } = await Swal.fire({ title: '¿Eliminar comentario?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar' });
    if (!isConfirmed) return;

    try {
      await firstValueFrom(this.commentsSrv.eliminarComentario(c.idComentario));
      await Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1200, showConfirmButton: false });
      this.cargarComentarios();
    } catch {
      await Swal.fire({ icon: 'error', title: 'No se pudo eliminar' });
    }
  }

  async denunciar(c: ComentarioDTO): Promise<void> {
    if (!c.idComentario) return;
    const { isConfirmed, value } = await Swal.fire({
      title: 'Denunciar comentario', input: 'textarea',
      inputValidator: v => !v?.trim() ? 'El motivo es obligatorio.' : undefined,
      showCancelButton: true, confirmButtonText: 'Enviar denuncia'
    });
    if (!isConfirmed) return;

    try {
      await firstValueFrom(this.commentsSrv.denunciarComentario(c.idComentario, value.trim()));
      await Swal.fire({ icon: 'success', title: 'Denuncia enviada', timer: 1200, showConfirmButton: false });
    } catch {
      await Swal.fire({ icon: 'error', title: 'No se pudo enviar la denuncia' });
    }
  }
}
