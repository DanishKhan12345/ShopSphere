import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../services/catalog';
import { Product } from '../../models/product.model';

import { MatCardModule} from '@angular/material/card';
import {  MatButtonModule} from '@angular/material/button';
import {  MatInputModule} from '@angular/material/input';
import {  MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {  MatSnackBar,  MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly snackBar = inject(MatSnackBar);
  readonly isSaving = signal(false);
  // Use a Signal to hold the state. This guarantees the UI updates when data changes.
  readonly products = signal<Product[]>([]);
  readonly editingProductId =   signal<number | null>(null);


  newProduct: Product = this.getEmptyProduct();

  ngOnInit(): void {
    this.loadProducts();
  }

  createProduct(): void
  {
    if (!this.isProductValid())
    {
      this.showErrorMessage('Please fill all required fields.');
      return;
    }
  
    if (this.editingProductId())
    {
      this.updateProduct();
      return;
    }
  
    this.isSaving.set(true);
  
    this.catalogService.createProduct(this.newProduct).subscribe({
      next: () =>
      {
        this.showSuccessMessage('Product created successfully.');
        this.newProduct = this.getEmptyProduct();
        this.loadProducts();
        this.isSaving.set(false);
      },
      error: () =>
      {
        this.showErrorMessage('Failed to create product.');
        this.isSaving.set(false);
      }
    });
  }

  updateProduct(): void {
    const productId = this.editingProductId();

    if (productId == null)
    {
      return;
    }
  
    this.isSaving.set(true);
    
    this.catalogService.updateProduct(productId, this.newProduct).subscribe({
      next: () => {
        this.showSuccessMessage('Product updated successfully.');
        this.editingProductId.set(null);
      this.newProduct = this.getEmptyProduct();
      this.loadProducts();
      this.isSaving.set(false);
      },
      error: () =>
      {
        this.showErrorMessage('Failed to update product.');
        this.isSaving.set(false);
      }
    });
  }
  
  editProduct(product: Product): void {
    this.editingProductId.set(product.id);
    this.newProduct =
  {
    ...product
  };
  }

  cancelEdit(): void {
  this.editingProductId.set(null);
  this.newProduct = this.getEmptyProduct();
  }

  deleteProduct(id: number): void {

    const confirmed =  confirm('Are you sure you want to delete this product?');

  if (!confirmed)
  {
    return;
  }
    
    this.catalogService.deleteProduct(id).subscribe({
      next: () => {
        this.showSuccessMessage('Product deleted successfully.');
        this.loadProducts();
      },
      error: (error) => {
        const message = error?.error?.message ?? 'Failed to delete product.';
    
      this.showErrorMessage( message);
      }
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

  private isProductValid(): boolean {

    return !!this.newProduct.name &&
           !!this.newProduct.description &&
           this.newProduct.price > 0 &&
           this.newProduct.stockQuantity >= 0;
  }

  private showSuccessMessage(
    message: string): void {
  
    this.snackBar.open(
      message,
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
  }
  
  private showErrorMessage(
    message: string): void {
  
    this.snackBar.open( message,'Close',
      {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
  }
}