import { Product } from './product';

export class WishlistItem {
    constructor(
        public id: number,
        public product: Product,
        public dateAdded: Date
    ) {}
}
