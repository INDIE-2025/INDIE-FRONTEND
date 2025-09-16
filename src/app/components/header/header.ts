import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { Dropdown } from "../dropdown/dropdown";
import { Filter } from "../filter/filter";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, Dropdown, Filter],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
