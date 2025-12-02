export class StockMovement {
    constructor(
        public id: number,
        public productId: number,
        public productName: string,
        public movementType: 'IN' | 'OUT' | 'ADJUSTMENT',
        public quantity: number,
        public previousStock: number,
        public newStock: number,
        public reason: string,
        public performedBy: string,
        public dateCreated: Date
    ) {}
}
