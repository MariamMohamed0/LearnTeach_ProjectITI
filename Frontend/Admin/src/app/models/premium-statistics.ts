export interface PremiumSummary {
    totalUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
}

export interface PremiumDistribution {
    silverMembers: number;
    goldMembers: number;
    platinumMembers: number;
}

export interface PremiumUser {
    username: string;
    subscriptionPlan: string;
    startDate: string; // ISO date string
    endDate: string;
    status: string; // Active, Expired, Upcoming
    totalPaid: number; // USD
    diamonds: number;
}
