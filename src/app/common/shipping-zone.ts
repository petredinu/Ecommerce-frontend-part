export class ShippingZone {
    constructor(
        public id: number,
        public name: string,
        public countries: string[], // country codes
        public shippingMethods: number[] // shipping method IDs
    ) {}
}
