import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly httpClient =  inject(HttpClient);

  private readonly baseUrl =
    `${environment.apiGatewayBaseUrl}/orders/api/orders`;

  getOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.baseUrl);
  }

  createOrder(
    productId: number,
    quantity: number): Observable<Order> {

    return this.httpClient.post<Order>(
      this.baseUrl,
      {
        productId,
        quantity
      });
  }
}