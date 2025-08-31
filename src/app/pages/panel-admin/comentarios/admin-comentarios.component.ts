import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../../../layout/admin-layout/admin-layout.component';
import { DataTableComponent, TableColumn, TableAction } from '../../../components/data-table/data-table.component';

@Component({
  selector: 'admin-comentarios-page',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent, DataTableComponent],
  template: `
    <admin-layout>
      <app-data-table
        [data]="denuncias"
        [columns]="columns"
        [actions]="actions"
        [showFilters]="false"
        [showPagination]="true"
        [showAddButton]="false"
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
    { key: 'usuarioDenunciante', label: 'Usuario denunciante', sortable: true },
    { key: 'usuarioDenunciado', label: 'Usuario denunciado', sortable: true },
    { key: 'comentario', label: 'Comentario', sortable: false },
    { key: 'motivoDenuncia', label: 'Motivo de denuncia', sortable: false },
    { key: 'fechaDenuncia', label: 'Fecha de denuncia', sortable: true },
    { key: 'acciones', label: 'Resolver', type: 'actions' }
  ];

  actions: TableAction[] = [
    { icon: 'fas fa-check', label: 'Resolver', action: 'resolve', class: 'action-button resolve' }
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

