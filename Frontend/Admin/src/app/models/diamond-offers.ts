export interface DiamondOffer {
    id: number;
    diamondPackageId: number;
    title: string;
    price: number;
    currency: string;
    diamondAmount: number;
}


export interface UpdateDiamondPackageRequest {
    id: number;
    title: string;
    diamondAmount: number;
    price: number;
    currency: string;
}


export interface CreateDiamondOfferRequest {
    title: string;
    diamondAmount: number;
    price: number;
    currency: string;
}

