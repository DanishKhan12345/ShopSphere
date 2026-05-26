import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'; // Added Icon Module
import { MatSelectModule} from '@angular/material/select';

import { OrderService } from '../../services/order';
import { Order } from '../../models/order.model';
import { CatalogService } from '../../services/catalog';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule // Added to imports
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class OrdersComponent {
  private readonly orderService = inject(OrderService);
  private readonly catalogService = inject(CatalogService);
  readonly products = signal<Product[]>([]);
  readonly createdOrder = signal<Order | null>(null);

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {

    this.catalogService.getProducts().subscribe({
        next: (products) =>
        {
          this.products.set(products);
        },
        error: (error) =>
        {
          console.error('Failed to load products', error);
        }
      });
  }

  productId = 0;
  quantity = 1;

  createOrder(): void {
    this.orderService.createOrder(this.productId, this.quantity).subscribe({
      next: (order) => {
        this.createdOrder.set(order);
      },
      error: (error) => {
        console.error('Failed to create order', error);
      }
    });
  }
}