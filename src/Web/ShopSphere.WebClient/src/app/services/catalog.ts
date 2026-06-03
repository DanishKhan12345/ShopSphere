import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly httpClient = inject(HttpClient);

  private readonly baseUrl =
    `${environment.apiGatewayBaseUrl}/catalog/api/products`;

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.baseUrl);
  }

  createProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>( this.baseUrl, product);
  }


  updateProduct(id: number, product: Product): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number)
  {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
}

