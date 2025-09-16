import { Component, OnInit } from '@angular/core';

import { AdminLayoutComponent } from '../../../layout/admin-layout/admin-layout.component';
import { DataTableComponent, TableColumn, TableAction } from '../../../components/data-table/data-table.component';

@Component({
  selector: 'admin-comentarios-page',
  standalone: true,
  imports: [AdminLayoutComponent, DataTableComponent],
  template: `
    <admin-layout>
      <app-data-table
        [data]="denuncias"
        [columns]="columns"
        [actions]="actions"
        searchPlaceholder="Buscar denuncia"
        (actionClicked)="onAction($event)">
      </app-data-table>
    </admin-layout>
  `
})
export class AdminComentariosPage implements OnInit {
  denuncias = [
    {
      usuarioDenunciante: 'usuario.denunciante',
      usuarioDenunciado: 'usuario.denunciado',
      comentario: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      motivoDenuncia: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      fechaDenuncia: '10/06/2025'
    },
    {
      usuarioDenunciante: 'usuario.denunciante',
      usuarioDenunciado: 'usuario.denunciado',
      comentario: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      motivoDenuncia: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      fechaDenuncia: '10/06/2025'
    },
    {
      usuarioDenunciante: 'usuario.denunciante',
      usuarioDenunciado: 'usuario.denunciado',
      comentario: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      motivoDenuncia: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      fechaDenuncia: '10/06/2025'
    },
    {
      usuarioDenunciante: 'usuario.denunciante',
      usuarioDenunciado: 'usuario.denunciado',
      comentario: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      motivoDenuncia: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      fechaDenuncia: '10/06/2025'
    },
    {
      usuarioDenunciante: 'usuario.denunciante',
      usuarioDenunciado: 'usuario.denunciado',
      comentario: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      motivoDenuncia: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      fechaDenuncia: '10/06/2025'
    },
    {
      usuarioDenunciante: 'usuario.denunciante',
      usuarioDenunciado: 'usuario.denunciado',
      comentario: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      motivoDenuncia: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      fechaDenuncia: '10/06/2025'
    },
    {
      usuarioDenunciante: 'usuario.denunciante',
      usuarioDenunciado: 'usuario.denunciado',
      comentario: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      motivoDenuncia: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      fechaDenuncia: '10/06/2025'
    },
    {
      usuarioDenunciante: 'usuario.denunciante',
      usuarioDenunciado: 'usuario.denunciado',
      comentario: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      motivoDenuncia: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      fechaDenuncia: '10/06/2025'
    },
    {
      usuarioDenunciante: 'usuario.denunciante',
      usuarioDenunciado: 'usuario.denunciado',
      comentario: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      motivoDenuncia: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      fechaDenuncia: '10/06/2025'
    }
  ];

  columns: TableColumn[] = [
    { key: 'usuarioDenunciante', label: 'Usuario denunciante' },
    { key: 'usuarioDenunciado', label: 'Usuario denunciado' },
    { key: 'comentario', label: 'Comentario' },
    { key: 'motivoDenuncia', label: 'Motivo de denuncia' },
    { key: 'fechaDenuncia', label: 'Fecha de denuncia' },
    { key: 'acciones', label: 'Resolver', type: 'actions' }
  ];

  actions: TableAction[] = [
  { src: '', label: 'Resolver', action: 'resolve', isButton: true }
  ];

  ngOnInit() {
    // Inicialización del componente
  }

  onAction(event: {action: string, item: any}) {
    switch(event.action) {
      case 'resolve':
        this.resolveDenuncia(event.item);
        break;
    }
  }

  resolveDenuncia(denuncia: any) {
    console.log('Resolver denuncia:', denuncia);
    // Implementar lógica para resolver denuncia
  }
}

