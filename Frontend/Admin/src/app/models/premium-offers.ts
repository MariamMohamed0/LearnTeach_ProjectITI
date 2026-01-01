export interface Package {
    packageId: number;
    packageName: string;
    packageDetails: string;
    packageDuration: string;
    packagePrice: number;
    diamondPoints: number;
    startDate?: string;
    endDate?: string;
    subscribedAt?: string;
}

// DTO لإضافة باقة جديدة
export interface CreatePackageDto {
    packageName: string;
    packageDetails: string;
    packageDuration: string;
    diamondPoints: number;
    packagePrice: number;
}

// DTO لتحديث باقة موجودة
export interface UpdatePackageDto {
    packageName: string;
    packageDetails: string;
    packageDuration: string;
    diamondPoints: number;
    packagePrice: number;
}

