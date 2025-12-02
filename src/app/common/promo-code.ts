export class PromoCode {
    id?: number;
    code!: string;
    discountType!: 'PERCENTAGE' | 'FIXED';
    discountValue!: number;
    minOrderValue?: number;
    expiryDate?: Date;
    usageLimit?: number;
    usedCount!: number;
    active!: boolean;
    createdDate?: Date;
    lastUpdated?: Date;
}
