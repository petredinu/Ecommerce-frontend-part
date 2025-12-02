export class StockAlert {
    constructor(
        public id: number,
        public productId: number,
        public productName: string,
        public currentStock: number,
        public minimumStock: number,
        public alertLevel: 'LOW' | 'CRITICAL' | 'OUT_OF_STOCK',
        public isActive: boolean,
        public dateCreated: Date
    ) {}
}
