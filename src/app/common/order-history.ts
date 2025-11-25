import { OrderItem } from './order-item';

export class OrderHistory {
    constructor(
        public orderTrackingNumber: string,
        public totalPrice: number,
        public totalQuantity: number,
        public dateCreated: Date,
        public status: string,
        // Proprietăți pentru relații
        public customer?: {
            firstName: string;
            lastName: string;
            email: string;
        },
        public shippingAddress?: {
            street: string;
            city: string;
            state: string;
            country: string;
            zipCode: string;
        },
        public billingAddress?: {
            street: string;
            city: string;
            state: string;
            country: string;
            zipCode: string;
        },
        public orderItems?: Array<{
            imageUrl: string;
            unitPrice: number;
            quantity: number;
            productId: number;
            name: string;
        }>
    ) {}
}
