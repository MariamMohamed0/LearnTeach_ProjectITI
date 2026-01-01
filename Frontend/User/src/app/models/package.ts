export interface Package {
    packageId: number;
    packageName: string;
    packageDetails: string;
    packageDuration: string;
    diamondPoints: number;
    packagePrice: number;
    startDate?: string;
    endDate?: string;
    subscribedAt?: string;
}

export interface UserPackage {
    id: number;
    userId: number;
    packageId: number;
    packageName: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface CreatePackageRequest {
    name: string;
    description?: string;
    price: number;
    duration: string;
    diamondPoints?: number;
}

export interface UpdatePackageRequest {
    name?: string;
    description?: string;
    price?: number;
    duration?: string;
    diamondPoints?: number;
    isActive?: boolean;
}

export interface PurchasePackageDto {
    userId: number;
    packageId: number;
}

export interface PurchasePackageRequest {
    packageId: number;
}

export function mapPackageFromApi(data: any): Package {
    return {
        packageId: data.Packageid,
        packageName: data.Packagename,
        packageDetails: data.Packagedetails,
        packageDuration: data.Packageduration,
        diamondPoints: data.Diamondpoints,
        packagePrice: data.Packageprice
    };
}
