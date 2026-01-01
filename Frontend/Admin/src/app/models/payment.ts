export interface Payment {
id: number;
userId?: number;
amount: number;
status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
type?: string;
referenceId?: string;
createdAt?: string;
updatedAt?: string;
}

export interface InitiatePaymentRequest {
amount: number;
type: string;
referenceId?: string;
}

export interface ConfirmPaymentRequest {
paymentId: number;
transactionId?: string;
}

export function mapPaymentFromApi(data: any): Payment {
return {
id: data.PayId,
amount: data.Amount,
status: data.Status.toLowerCase() as 'pending' | 'confirmed' | 'failed' | 'cancelled',
referenceId: data.GetwayTransactionId,
createdAt: data.TransactionDate,
userId: data.UserId,
type: data.Token
};
}
