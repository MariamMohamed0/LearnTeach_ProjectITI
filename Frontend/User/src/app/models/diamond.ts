
/////////////////////    diamond-popup-component     //////////////////////

export interface Diamond {
    userId: number;
    totalPoints: number;
    lastUpdated?: string;
}

export interface DiamondPackage {
    diamondPackageId: number;
    title: string;
    diamondAmount: number;
    price: number;
    currency: string;
}

export interface PurchaseDiamondPackage {
    userId: number;
    diamondPackageId: number;
}


////////////////////////  diamond-dashboard-component  //////////////////////

export interface DiamondAverage {
    averageDiamonds: number;
}

export interface DiamondBuyersCount {
    buyersCount: number;
}

export interface TotalUsd {
    totalUsd: number;
}

export interface DiamondTransaction {
    reason: string;
    pointsChanged: number;
    date: string;  // أو Date حسب استخدامك
    priceUsd?: number;
}

export interface UserDiamondDetail {
    username: string;
    currentDiamonds: number;
    purchasedBefore: boolean;
    totalDiamondBought: number;
    totalUsd: number;
    diamondTransactions: DiamondTransaction[];
}






