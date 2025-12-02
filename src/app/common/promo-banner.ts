export class PromoBanner {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public imageUrl: string,
        public linkUrl: string,
        public buttonText: string,
        public active: boolean,
        public backgroundColor: string,
        public textColor: string,
        public createdDate: Date,
        public lastUpdated: Date
    ) {}
}
