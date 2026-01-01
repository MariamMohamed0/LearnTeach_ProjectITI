export interface Package {
id: number;
name: string;
description?: string;
duration: string;
diamondPoints: number;
price: number;
isActive?: boolean;
createdAt?: string;
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

export interface PurchasePackageRequest {
packageId: number;
}

export function mapPackageFromApi(data: any): Package {
return {
id: data.Packageid,
name: data.Packagename,
description: data.Packagedetails,
duration: data.Packageduration,
diamondPoints: data.Diamondpoints,
price: data.Packageprice
};
}
