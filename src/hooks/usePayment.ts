import { useState, useRef, useEffect } from "react";
import { CheckoutResponseDTO, PaymentStatus, PaymentStatusDTO, CreateCheckoutRequestDTO } from "@/lib/dtos";
import { useApi } from "./useApi";

export type PaymentHookStatus = "idle" | "creating" | "awaiting_payment" | "success" | "error" | "expired";

export function usePayment() {
  const { apiCall } = useApi();
  const [status, setStatus] = useState<PaymentHookStatus>("idle");
  const [checkoutInfo, setCheckoutResponse] = useState<CheckoutResponseDTO | null>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchPending = async () => {
    try {
      const data: CheckoutResponseDTO | null = await apiCall("/payments/pending");
      if (data) {
        setCheckoutResponse(data);
        setStatus("awaiting_payment");
        startPolling(data.id);
      }
    } catch (err) {
      console.error("Error fetching pending payment:", err);
    }
  };

  useEffect(() => {
    fetchPending();

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  const createPayment = async (quantity: number) => {
    setStatus("creating");
    try {
      const createReq: CreateCheckoutRequestDTO = { quantity };
      const data: CheckoutResponseDTO = await apiCall("/payments/checkout", {
        method: "POST",
        body: JSON.stringify(createReq),
      });

      setCheckoutResponse(data);
      setStatus("awaiting_payment");
      startPolling(data.id);
    } catch (err) {
      setStatus("error");
      console.error("Error creating payment:", err);
    }
  };

  const startPolling = (paymentId: string) => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);

    pollingInterval.current = setInterval(async () => {
      try {
        const data: PaymentStatusDTO = await apiCall(`/payments/${paymentId}/status`);
        
        if (data.status === "approved") {
          stopPolling();
          setStatus("success");
        } else if (data.status === "expired" || data.status === "rejected" || data.status === "cancelled") {
          stopPolling();
          setStatus(data.status === "expired" ? "expired" : "error");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000);
  };

  const cancelPayment = async () => {
    if (!checkoutInfo) return;
    try {
      await apiCall(`/payments/${checkoutInfo.id}/cancel`, { method: "POST" });
      stopPolling();
      setStatus("idle");
      setCheckoutResponse(null);
    } catch (err) {
      console.error("Error cancelling payment:", err);
    }
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
    cancelPayment,
    resetPayment
  };
}
