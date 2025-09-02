// import { Component, Input, OnInit } from '@angular/core';
// import { CommentsService, ComentarioDTO } from '../services/comments.service';

// @Component({
//   selector: 'app-comments',
//   templateUrl: './comments.component.html'
// })
// export class CommentsComponent implements OnInit {
//   @Input() idUsuarioComentado!: string; // viene del profile
//   comentarios: ComentarioDTO[] = [];
//   nuevoComentario: string = '';

//   constructor(@Inject(CommentsService) private commentsService: CommentsService) {}

//   ngOnInit(): void {
//     this.cargarComentarios();
//   }

//   cargarComentarios() {
//     this.commentsService.traerComentariosDeUnUsuario(this.idUsuarioComentado)
//       .subscribe(data => this.comentarios = data);
//   }

//   realizarComentario(idUsuarioComentador: string) {
//     this.commentsService.realizarComentario(this.nuevoComentario, idUsuarioComentador, this.idUsuarioComentado)
//       .subscribe(() => {
//         this.nuevoComentario = '';
//         this.cargarComentarios(); // refresca lista
//       });
//   }
// }
