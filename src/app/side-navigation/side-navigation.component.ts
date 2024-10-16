import { CommonModule } from '@angular/common';
import { Component, Input, Signal, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-navigation',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.scss',
})
export class SideNavigationComponent {
  @Input({ required: true })
  collapsed!: Signal<boolean>;
  iconSize = computed(() => this.collapsed() ? '32px' : '100px');

  protected menuItems: Signal<MenuItem[]> = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard',
    },
    {
      icon: 'car_rental',
      label: 'Rentals',
      route: 'rentals',
    },
    {
      icon: 'directions_car',
      label: 'Cars',
      route: 'cars',
    },
  ]);
}

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
};
