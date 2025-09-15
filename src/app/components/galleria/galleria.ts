// import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MediaService, MediaItem } from '../../services/media.service';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-galleria',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './galleria.html',
//   styleUrls: ['./galleria.scss']
// })
// export class Galleria implements OnInit, AfterViewInit {
//   /** ID del dueño del perfil (usuario/establecimiento) */
//   @Input({ required: true }) targetId!: string;
//   /** Permisos para subir/borrar (perfil propio) */
//   @Input() canUpload = false;
//   /** Enum del back: ajustá al valor real (USUARIO/EVENTO/OTRO) */
//   @Input() tipoClase: 'USUARIO' | 'EVENTO' | 'OTRO' = 'USUARIO';

//   /** Tamaño del grupo por slide (3 ítems por slide) */
//   @Input() chunkSize = 3;

//   /** (Opcional) auto-slide */
//   @Input() auto = false;
//   @Input() intervalMs = 5000;

//   items: MediaItem[] = [];
//   slides: MediaItem[][] = []; // items chunked

//   loading = false;
//   selectedFiles: File[] = [];
//   uploading = false;
//   progress: Record<string, number> = {};

//   carouselId = 'galleria_' + Math.random().toString(36).slice(2, 9);
//   @ViewChild('carouselEl') carouselEl!: ElementRef<HTMLElement>;

//   constructor(private media: MediaService) {}

//   ngOnInit(): void {
//     this.cargar();
//   }

//   ngAfterViewInit(): void {
//     // Pausar videos al cambiar de slide (si tenés bootstrap JS cargado)
//     const el = this.carouselEl?.nativeElement;
//     if (!el) return;
//     el.addEventListener('slide.bs.carousel', () => {
//       el.querySelectorAll('video').forEach(v => v.pause());
//     });
//   }

//   private makeChunks(): void {
//     const chunks: MediaItem[][] = [];
//     for (let i = 0; i < this.items.length; i += this.chunkSize) {
//       chunks.push(this.items.slice(i, i + this.chunkSize));
//     }
//     this.slides = chunks;
//   }

//   cargar(): void {
//     this.loading = true;
//     this.media.listar(this.tipoClase, this.targetId).subscribe({
//       next: (list) => {
//         this.items = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
//         this.makeChunks();
//         this.loading = false;
//         // Reiniciar posición al primer slide (opcional)
//         setTimeout(() => this.resetCarousel());
//       },
//       error: (e) => {
//         this.loading = false;
//         console.error(e);
//       }
//     });
//   }

//   private resetCarousel(): void {
//     const el = this.carouselEl?.nativeElement;
//     if (!el) return;
//     // Si usás bootstrap JS, podés re-inicializar si querés. No estrictamente necesario.
//   }

//   onFileChange(ev: Event): void {
//     const input = ev.target as HTMLInputElement;
//     if (!input.files || input.files.length === 0) return;
//     this.selectedFiles = Array.from(input.files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
//   }

//   async subir(): Promise<void> {
//     if (!this.selectedFiles.length) return;
//     this.uploading = true;
//     this.progress = {};
//     try {
//       for (const f of this.selectedFiles) {
//         this.progress[f.name] = 0;
//         await new Promise<void>((resolve, reject) => {
//           this.media.subirConProgreso(f, this.tipoClase, this.targetId).subscribe({
//             next: ({ progress, item }) => {
//               this.progress[f.name] = progress;
//               if (item) {
//                 // Inserta al principio y re-chunkea
//                 this.items = [item, ...this.items];
//                 this.makeChunks();
//               }
//             },
//             error: reject,
//             complete: () => resolve()
//           });
//         });
//       }
//       await Swal.fire({ icon: 'success', title: 'Archivos subidos', timer: 1200, showConfirmButton: false });
//       this.selectedFiles = [];
//     } catch (e) {
//       console.error(e);
//       await Swal.fire({ icon: 'error', title: 'Error al subir', text: 'Reintentá más tarde.' });
//     } finally {
//       this.uploading = false;
//     }
//   }

//   async eliminar(item: MediaItem): Promise<void> {
//     const { isConfirmed } = await Swal.fire({
//       title: '¿Eliminar archivo?',
//       text: item.nombreArchivo,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar'
//     });
//     if (!isConfirmed) return;

//     this.media.eliminar(item.id).subscribe({
//       next: async () => {
//         this.items = this.items.filter(i => i.id !== item.id);
//         this.makeChunks();
//         await Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1000, showConfirmButton: false });
//       },
//       error: async (e) => {
//         console.error(e);
//         await Swal.fire({ icon: 'error', title: 'No se pudo eliminar' });
//       }
//     });
//   }

//   isImage(i: MediaItem) { return i.tipoArchivo?.startsWith('image/'); }
//   isVideo(i: MediaItem) { return i.tipoArchivo?.startsWith('video/'); }
// }
