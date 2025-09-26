import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Dropdown } from "../dropdown/dropdown";
import { Filter } from "../filter/filter";
import { ChatServiceFacade } from '../../services/chat.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, Dropdown, Filter],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  constructor(public chatFacade: ChatServiceFacade) {}

  ngOnInit(): void {
    this.chatFacade.loadChats();
    this.chatFacade.startAutoRefresh(30000);
  }
}
