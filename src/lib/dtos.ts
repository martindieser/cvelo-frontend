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
