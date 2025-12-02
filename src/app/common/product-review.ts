export class ProductReview {
    constructor(
        public id: number,
        public productId: number,
        public userId: string,
        public userEmail: string,
        public userName: string,
        public rating: number, // 1-5 stars
        public title: string,
        public comment: string,
        public verifiedPurchase: boolean,
        public helpfulCount: number,
        public dateCreated: Date,
        public dateModified?: Date
    ) {}
}
