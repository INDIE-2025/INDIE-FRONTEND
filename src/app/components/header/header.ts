import { Component } from '@angular/core';
import { Dropdown } from "../dropdown/dropdown";
import { Filter } from "../filter/filter";

@Component({
  selector: 'app-header',
  imports: [Dropdown, Filter],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
