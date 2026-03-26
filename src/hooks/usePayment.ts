import { useState, useRef, useEffect } from "react";
import { CheckoutResponseDTO, PaymentStatus, PaymentStatusDTO } from "@/lib/dtos";

export type PaymentHookStatus = "idle" | "creating" | "awaiting_payment" | "success" | "error" | "expired";

export function usePayment() {
  const [status, setStatus] = useState<PaymentHookStatus>("idle");
  const [checkoutInfo, setCheckoutResponse] = useState<CheckoutResponseDTO | null>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  const createPayment = async (packId: string) => {
    setStatus("creating");
    try {
      // Simulate API call to create payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse: CheckoutResponseDTO = {
        id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        invoice_url: "https://example.com/invoice/mock_123", 
        qr_code: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg", // Mock QR
        amount: 10,
        currency: "USD"
      };

      setCheckoutResponse(mockResponse);
      setStatus("awaiting_payment");
      
      // We no longer auto-open the window
      
      // Start polling
      startPolling(mockResponse.id);
    } catch (err) {
      setStatus("error");
      console.error("Error creating payment:", err);
    }
  };

  const startPolling = (paymentId: string) => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);

    let attempts = 0;
    const maxAttempts = 40; // Approx 2 minutes with 3s interval

    pollingInterval.current = setInterval(async () => {
      attempts++;
      
      if (attempts > maxAttempts) {
        stopPolling();
        setStatus("expired");
        return;
      }

      try {
        // Simulate API call to check status
        // In a real app: fetch(`/api/payments/${paymentId}/status`)
        const mockStatus: PaymentStatus = attempts > 5 ? "paid" : "pending"; 
        
        if (mockStatus === "paid") {
          stopPolling();
          setStatus("success");
        } else if (mockStatus === "failed") {
          stopPolling();
          setStatus("error");
        } else if (mockStatus === "expired") {
          stopPolling();
          setStatus("expired");
        }
        // If "pending", we just keep polling
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const resetPayment = () => {
    stopPolling();
    setStatus("idle");
    setCheckoutResponse(null);
  };

  return {
    status,
    checkoutInfo,
    createPayment,
    resetPayment
  };
}
