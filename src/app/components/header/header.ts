import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Dropdown } from "../dropdown/dropdown";
import { Filter } from "../filter/filter";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, Dropdown, Filter],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
