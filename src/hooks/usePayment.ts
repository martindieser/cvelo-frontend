import { useState, useRef, useEffect } from "react";
import { CheckoutResponseDTO, PaymentStatus, PaymentStatusDTO } from "@/lib/dtos";

export type PaymentHookStatus = "idle" | "creating" | "awaiting_payment" | "success" | "error" | "expired";

export function usePayment() {
  const [status, setStatus] = useState<PaymentHookStatus>("idle");
  const [checkoutInfo, setCheckoutResponse] = useState<CheckoutResponseDTO | null>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  // Initial check for pending payments
  useEffect(() => {
    const fetchPending = async () => {
      // In a real app: const response = await fetch('/api/payments/pending')
      // Simulate checking for a pending payment in localStorage or API
      const savedPending = localStorage.getItem("pending_payment");
      if (savedPending) {
        const info = JSON.parse(savedPending);
        setCheckoutResponse(info);
        setStatus("awaiting_payment");
        startPolling(info.id);
      }
    };
    fetchPending();

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  const createPayment = async (packId: string) => {
    setStatus("creating");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse: CheckoutResponseDTO = {
        id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        invoice_url: "https://example.com/invoice/mock_123", 
        qr_code: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
        amount: 10,
        currency: "USD"
      };

      localStorage.setItem("pending_payment", JSON.stringify(mockResponse));
      setCheckoutResponse(mockResponse);
      setStatus("awaiting_payment");
      startPolling(mockResponse.id);
    } catch (err) {
      setStatus("error");
      console.error("Error creating payment:", err);
    }
  };

  const startPolling = (paymentId: string) => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);

    let attempts = 0;
    pollingInterval.current = setInterval(async () => {
      attempts++;
      
      try {
        // Simulate API check
        // If we found it paid, clean up
        const isPaid = attempts > 8; // Simulate success after some time
        
        if (isPaid) {
          stopPolling();
          localStorage.removeItem("pending_payment");
          setStatus("success");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);
  };

  const cancelPayment = async () => {
    // In a real app: await fetch(`/api/payments/${checkoutInfo?.id}/cancel`, { method: 'POST' })
    stopPolling();
    localStorage.removeItem("pending_payment");
    setStatus("idle");
    setCheckoutResponse(null);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const resetPayment = () => {
    stopPolling();
    localStorage.removeItem("pending_payment");
    setStatus("idle");
    setCheckoutResponse(null);
  };

  return {
    status,
    checkoutInfo,
    createPayment,
    cancelPayment,
    resetPayment
  };
}
