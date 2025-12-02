import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {
    // Declaram proprietatile
    customer!: Customer; // Folosim '!' pentru a indica ca stim ca va fi initializat ulterior
    shippingAddress!: Address;
    billingAddress!: Address;
    order!: Order;
    orderItems!: OrderItem[];
    promoCode?: string; // Optional promo code field

    // Constructor gol, care nu cere argumente la creare
    constructor() { }
}