declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID ;

export interface PaymentOrderData {
  id: string;
  amount: number;
  currency: string;
}

export function initializeRazorpay(
  orderData: PaymentOrderData,
  userDetails: {
    name: string;
    email: string;
    phone?: string;
  },
  onSuccess: (response: RazorpayResponse) => void,
  onDismiss?: () => void
): void {
  if (!window.Razorpay) {
    throw new Error('Razorpay SDK not loaded');
  }

  if (!RAZORPAY_KEY_ID) {
    throw new Error('Razorpay Key ID not configured');
  }

  const options: RazorpayOptions = {
    key: RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'ShopNest',
    description: 'Order Payment',
    order_id: orderData.id,
    handler: onSuccess,
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.phone,
    },
    theme: {
      color: '#6366f1',
    },
    modal: {
      ondismiss: onDismiss,
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
}
