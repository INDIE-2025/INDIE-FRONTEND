import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommentsService, ComentarioDTO } from '../../services/commentsService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.html',
  styleUrls: ['./comments.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CommentsComponent implements OnInit {
  @Input() idUsuarioComentado?: string;
  @Input() idUsuarioComentador?: string;

  comentarios: ComentarioDTO[] = [];
  loadingList = false;
  posting = false;
  errorMsg: string | null = null;

  form: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    @Inject(CommentsService) private commentsSrv: CommentsService
  ) {
    this.form = this.fb.group({
      comentario: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    console.log('CommentsComponent ngOnInit:', {
      idUsuarioComentado: this.idUsuarioComentado,
      idUsuarioComentador: this.idUsuarioComentador
    });
    
    if (!this.idUsuarioComentado) {
      console.warn('No se proporcionó idUsuarioComentado');
      return;
    }
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    if (!this.idUsuarioComentado) {
      console.warn('No hay idUsuarioComentado para cargar comentarios');
      return;
    }
    
    console.log('Cargando comentarios para usuario:', this.idUsuarioComentado);
    this.loadingList = true;
    this.errorMsg = null;
    this.commentsSrv.traerComentariosDeUnUsuario(this.idUsuarioComentado).subscribe({
      next: (data: any) => {
        console.log('Comentarios recibidos:', data);
        this.comentarios = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loadingList = false;
      },
      error: (err: any) => {
        console.error('Error al cargar comentarios:', err);
        this.errorMsg = 'No se pudieron cargar los comentarios. Verifique la conexión con el servidor.';
        this.loadingList = false;
      },
    });
  }

  get f() { return this.form.controls; }

  enviar(): void {
    if (!this.idUsuarioComentador) {
      this.errorMsg = 'Debe iniciar sesión para comentar.';
      return;
    }
    
    if (!this.idUsuarioComentado) {
      this.errorMsg = 'Error: No se puede identificar el usuario al que se comenta.';
      return;
    }
    
    if (this.form.invalid) {
      this.errorMsg = 'Por favor corrija los errores en el formulario.';
      return;
    }
    
    const comentario = (this.f['comentario'].value || '').trim();
    if (!comentario) {
      this.errorMsg = 'El comentario no puede estar vacío.';
      return;
    }

    console.log('Enviando comentario:', {
      comentario,
      idUsuarioComentador: this.idUsuarioComentador,
      idUsuarioComentado: this.idUsuarioComentado
    });

    this.posting = true;
    this.errorMsg = null;
    this.commentsSrv
      .realizarComentario(comentario, this.idUsuarioComentador, this.idUsuarioComentado)
      .subscribe({
        next: (response) => {
          console.log('Comentario enviado exitosamente:', response);
          this.form.reset();
          this.posting = false;
          this.cargarComentarios();
        },
        error: (err: any) => {
          console.error('Error al enviar comentario:', err);
          this.posting = false;
          this.errorMsg = 'No se pudo publicar el comentario. Verifique la conexión con el servidor.';
        },
      });
  }
}
