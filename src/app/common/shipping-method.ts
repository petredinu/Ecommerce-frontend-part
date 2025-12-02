export class ShippingMethod {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public deliveryDays: string, // e.g., "3-5 days"
        public basePrice: number,
        public active: boolean,
        public pricePerKg?: number,
        public freeShippingThreshold?: number
    ) {}
}
