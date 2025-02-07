import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { KeycloakService } from '../keycloak.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatToolbarModule, CommonModule, MatButton],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  keycloakService = inject(KeycloakService);
  user = this.keycloakService.profile;
}
