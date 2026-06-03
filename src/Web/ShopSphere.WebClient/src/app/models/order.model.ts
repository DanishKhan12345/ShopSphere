export interface Order {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdOnUtc: string;
  }
  