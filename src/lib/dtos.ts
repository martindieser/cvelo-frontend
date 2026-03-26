/**
 * Data Transfer Objects (DTOs) for Auth
 * These represent the raw data structure for API communication.
 */

export interface LoginRequestDTO {
  email: string;
  password?: string; // Optional if using social login later
}

export interface RegisterRequestDTO {
  name: string;
  email: string;
  password?: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    id: string;
    full_name: string;
    email_address: string;
    profile_pic?: string;
    available_credits: number;
  };
}

// --- Payment & Checkout DTOs ---

export interface CreateCheckoutRequestDTO {
  pack_id: string;
}

export interface CheckoutResponseDTO {
  id: string;
  invoice_url: string;
  qr_code?: string; // Base64 or image URL
  amount: number;
  currency: string;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export interface PaymentStatusDTO {
  id: string;
  status: PaymentStatus;
  credits_awarded?: number;
}
