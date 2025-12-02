import { Product } from "./product";

export class PriceAlert {
    constructor(
        public id: number,
        public userEmail: string,
        public productId: number,
        public product: Product,
        public targetPrice: number,
        public originalPrice: number,
        public lastCheckedPrice: number,
        public isActive: boolean,
        public dateCreated: Date,
        public notifiedDate: Date | null
    ) {}
}
