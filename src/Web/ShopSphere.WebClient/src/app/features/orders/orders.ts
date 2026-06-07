import { Component, computed, inject,OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';


import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class OrdersComponent implements OnInit {
  private readonly snackBar = inject(MatSnackBar);
  private readonly orderService = inject(OrderService);
  private readonly catalogService = inject(CatalogService);

  readonly products = signal<Product[]>([]);
  readonly createdOrder = signal<Order | null>(null);

  readonly productId = signal<number | null>(null);
  readonly quantity = signal<number>(1);

  readonly orders = signal<Order[]>([]);

  ngOnInit(): void
  {
    this.loadProducts();
    this.loadOrders();
  }


  private loadOrders(): void
  {
    this.orderService.getOrders().subscribe({
      next: (orders) =>
      {
        this.orders.set(orders);
      },
      error: (error) =>
      {
        console.error('Failed to load orders', error);
      }
    });
  }
  readonly selectedProduct = computed(() =>
  {
    return this.products().find(product =>
      product.id === this.productId());
  });

  readonly totalAmount = computed(() =>
  {
    const product = this.selectedProduct();

    if (!product)
    {
      return 0;
    }

    return product.price * this.quantity();
  });

  readonly canPlaceOrder = computed(() =>
  {
    const product = this.selectedProduct();

    if (!product)
    {
      return false;
    }

    return this.quantity() > 0 &&
           this.quantity() <= product.stockQuantity;
  });

  private loadProducts(): void
  {
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

  createOrder(): void
  {
    const selectedProductId = this.productId();

    if (selectedProductId == null)
    {
      return;
    }

    this.orderService.createOrder(selectedProductId, this.quantity()).subscribe({
      next: (order) =>
      {
        this.createdOrder.set(order);
        this.productId.set(null);
        this.quantity.set(1);
        this.showSuccessMessage('Order created successfully.');
        this.loadOrders();
      },
      error: (error) =>
      {
        console.error('Failed to create order', error);
        const message =  error?.error?.message ?? 'Failed to create order.';
        this.showErrorMessage(message);
      }
    });
  }


  private showSuccessMessage(message: string): void
  {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private showErrorMessage(message: string): void
  {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}