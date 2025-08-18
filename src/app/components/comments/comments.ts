// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { CommentsService, Comment } from '../services/comments.service';

// @Component({
//   selector: 'app-comments',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './comments.html',
//   styleUrls: ['./comments.css']
// })
// export class ProfileCommentsComponent implements OnInit {
//   comments: Comment[] = [];
//   profileId = 1; 

//   constructor(private commentsService: CommentsService) {}

//   ngOnInit(): void {
//     this.loadComments();
//   }

//   loadComments(): void {
//     this.commentsService.getCommentsByProfile(this.profileId).subscribe({
//       next: (data) => this.comments = data,
//       error: (err) => console.error('Error al cargar comentarios', err)
//     });
//   }
// }
