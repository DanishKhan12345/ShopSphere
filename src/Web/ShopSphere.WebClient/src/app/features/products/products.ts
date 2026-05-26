import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../services/catalog';
import { Product } from '../../models/product.model';

import { MatCardModule} from '@angular/material/card';
import {  MatButtonModule} from '@angular/material/button';
import {  MatInputModule} from '@angular/material/input';
import {  MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);

  // Use a Signal to hold the state. This guarantees the UI updates when data changes.
  products = signal<Product[]>([]);

  newProduct: Product = this.getEmptyProduct();

  ngOnInit(): void {
    this.loadProducts();
  }

  createProduct(): void {
    this.catalogService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.newProduct = this.getEmptyProduct(); // Reset form
        this.loadProducts(); // Refresh list
      },
      error: (err) => console.error('Failed to create product:', err)
    });
  }

  private loadProducts(): void {
    this.catalogService.getProducts().subscribe({
      next: (data) => {
        // Update the signal with the new data
        this.products.set(data);
      },
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  private getEmptyProduct(): Product {
    return { id: 0, name: '', description: '', price: 0, stockQuantity: 0 };
  }
}