import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  mobileOpen = false;

  toggleMenu(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMenu(): void {
    this.mobileOpen = false;
  }
}
