import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommentsService, ComentarioDTO } from '../../services/commentsService';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.html',
  styleUrls: ['./comments.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})

export class CommentsComponent implements OnInit {
  @Input() idUsuarioComentado?: string;
  // ID del usuario actual que escribe (lo pasás "a mano" hasta tener Auth/UserService).
  @Input() idUsuarioComentador?: string;

  // Lista de comentarios a mostrar.
  comentarios: ComentarioDTO[] = [];
  // Estado de carga cuando se trae la lista.
  loadingList = false;
  // Estado de envío cuando se publica un nuevo comentario.
  posting = false;
  // Mensaje de error genérico a mostrar en pantalla.
  errorMsg: string | null = null;

  form: ReturnType<FormBuilder['group']>;

  // Inyecta FormBuilder para crear el form y el servicio para llamar al back.
  constructor(
    private fb: FormBuilder,
    private commentsSrv: CommentsService // NO hace falta @Inject(...) porque providedIn:'root'
  ) {
    // Define el formulario con un control 'comentario' requerido y con máximo 1000 caracteres.
    this.form = this.fb.group({
      comentario: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  // Hook de inicio: cuando el componente se monta.
  ngOnInit(): void {
    // Log simple para depurar que llegaron los inputs.
    console.log('CommentsComponent ngOnInit:', {
      idUsuarioComentado: this.idUsuarioComentado,
      idUsuarioComentador: this.idUsuarioComentador
    });
    
    // Si no hay id del usuario dueño del perfil, no se puede cargar la lista.
    if (!this.idUsuarioComentado) {
      console.warn('No se proporcionó idUsuarioComentado');
      return;
    }
    // Carga inicial de comentarios.
    this.cargarComentarios();
  }

  // Trae los comentarios desde el backend.
  cargarComentarios(): void {
    if (!this.idUsuarioComentado) {
      console.warn('No hay idUsuarioComentado para cargar comentarios');
      return;
    }
    
    console.log('Cargando comentarios para usuario:', this.idUsuarioComentado);
    this.loadingList = true;
    this.errorMsg = null;

    // Llama al service que pega al backend.
    this.commentsSrv.traerComentariosDeUnUsuario(this.idUsuarioComentado).subscribe({
      // Si responde OK:
      next: (data: ComentarioDTO[]) => {
        // Loguea respuesta cruda.
        console.log('Comentarios recibidos:', data);
        // Copia y ordena por fecha desc (más nuevos primero).
        this.comentarios = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Quita estado de carga.
        this.loadingList = false;
      },
      // Si hay error en la llamada:
      error: (err: any) => {
        console.error('Error al cargar comentarios:', err);
        this.errorMsg = 'No se pudieron cargar los comentarios. Verifique la conexión con el servidor.';
        this.loadingList = false;
      },
    });
  }

  // Getter corto para acceder a los controles del form en el template.
  get f() { return this.form.controls; }

  // Envía un nuevo comentario al backend.
  enviar(): void {
    if (!this.idUsuarioComentador) {
      this.errorMsg = 'Debe iniciar sesión para comentar.';
      return;
    }
    
    // Si no hay target, no se puede comentar.
    if (!this.idUsuarioComentado) {
      this.errorMsg = 'Error: No se puede identificar el usuario al que se comenta.';
      return;
    }
    
    // Si el form es inválido (falta requerido o supera maxlength).
    if (this.form.invalid) {
      this.errorMsg = 'Por favor corrija los errores en el formulario.';
      return;
    }
    
    // Toma el texto, quita espacios sobrantes.
    const comentario = (this.f['comentario'].value || '').trim();
    // Si quedó vacío (p. ej., el usuario puso solo espacios).
    if (!comentario) {
      this.errorMsg = 'El comentario no puede estar vacío.';
      return;
    }

    // Loguea lo que se va a enviar (útil durante desarrollo).
    console.log('Enviando comentario:', {
      comentario,
      idUsuarioComentador: this.idUsuarioComentador,
      idUsuarioComentado: this.idUsuarioComentado
    });

    // Activa estado de envío y limpia errores.
    this.posting = true;
    this.errorMsg = null;

    // Llama al endpoint de crear comentario con tus parámetros.
    this.commentsSrv
      .realizarComentario(comentario, this.idUsuarioComentador, this.idUsuarioComentado)
      .subscribe({
        // Si todo salió bien:
        next: (response) => {
          // Loguea respuesta del back.
          console.log('Comentario enviado exitosamente:', response);
          // Limpia el form.
          this.form.reset();
          // Quita estado de envío.
          this.posting = false;
          // Recarga la lista para ver el nuevo comentario.
          this.cargarComentarios();
        },
        // Si hubo error en el envío:
        error: (err: any) => {
          // Log en consola para diagnóstico.
          console.error('Error al enviar comentario:', err);
          // Quita estado de envío.
          this.posting = false;
          // Mensaje genérico para la UI.
          this.errorMsg = 'No se pudo publicar el comentario. Verifique la conexión con el servidor.';
        },
      });
  }

  // ====== OPCIONAL: acciones por comentario (requiere que el back devuelva idComentario) ======

  // Determina si el usuario actual puede eliminar un comentario (aquí: solo el autor).
  puedeEliminar(c: ComentarioDTO): boolean {
    return !!this.idUsuarioComentador && c.idUsuarioComentador === this.idUsuarioComentador;
  }

  // Eliminar un comentario (UI sencilla, sin optimistic update).
  async eliminar(c: ComentarioDTO): Promise<void> {
    if (!c.idComentario || !this.idUsuarioComentador) return;

    // 1) Confirmación
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar comentario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#483186',
      cancelButtonColor: 'rgba(80, 78, 78, 1)',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!isConfirmed) return;

    // 2) Llamar a la API
    try {
      await firstValueFrom(
        this.commentsSrv.eliminarComentario(c.idComentario, this.idUsuarioComentador)
      );

      // 3) Éxito
      await Swal.fire({
        title: 'Eliminado',
        text: 'El comentario fue eliminado.',
        icon: 'success',
        timer: 1400,
        showConfirmButton: false
      });

      // 4) Refrescar lista
      this.cargarComentarios();

    } catch (err) {
      console.error('Error al eliminar comentario:', err);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el comentario.',
        icon: 'error'
      });
    }
 }





  // Denunciar un comentario con un motivo fijo de ejemplo (podés abrir un formulario si querés).
  async denunciar(c: ComentarioDTO): Promise<void> {
    // Validaciones mínimas con feedback visual
    if (!c.idComentario) {
      await Swal.fire({ icon: 'error', title: 'Dato faltante', text: 'No llegó el id del comentario.' });
      return;
    }
    if (!this.idUsuarioComentador) {
      await Swal.fire({ icon: 'warning', title: 'Sesión requerida', text: 'Iniciá sesión para denunciar.' });
      return;
    }

    // Popup con textarea para el motivo
    const { isConfirmed } = await Swal.fire({
      title: 'Denunciar comentario',
      text: 'Contanos brevemente el motivo.',
      input: 'textarea',
      inputLabel: 'Motivo',
      inputPlaceholder: 'Escribe el motivo de la denuncia…',
      inputAttributes: { maxlength: '300', 'aria-label': 'Motivo de la denuncia' },
      inputValidator: (v: string) => {
        if (!v || !v.trim()) return 'El motivo es obligatorio.';
        if (v.trim().length < 5) return 'El motivo debe tener al menos 5 caracteres.';
        return undefined;
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar denuncia',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#483186',
      cancelButtonColor: 'rgba(80, 78, 78, 1)',
      showLoaderOnConfirm: true,
      // preConfirm recibe el valor del input (motivo)
      preConfirm: async (motivo: string) => {
        try {
          await firstValueFrom(
            this.commentsSrv.denunciarComentario(
              c.idComentario!, this.idUsuarioComentador!, motivo.trim()
            )
          );
        } catch (e) {
          Swal.showValidationMessage('No se pudo enviar la denuncia.');
          throw e;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (isConfirmed) {
      await Swal.fire({
        icon: 'success',
        title: 'Denuncia enviada',
        timer: 1400,
        showConfirmButton: false,
      });
      // (opcional) refrescar algo si querés marcar que fue denunciado
      // this.cargarComentarios();
    }
  }


}
