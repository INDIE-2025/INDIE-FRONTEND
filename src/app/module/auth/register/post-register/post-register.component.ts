import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-post-register",
  templateUrl: "./post-register.component.html",
  styleUrls: ["./post-register.component.scss"],
})
export class PostRegisterComponent {
  constructor(private router: Router) {}

  login() {
    this.router.navigate(["/login"]);
  }

}
