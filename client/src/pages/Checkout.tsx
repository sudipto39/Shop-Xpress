import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Loader2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useCreateOrder, useCreatePayment, useVerifyPayment } from '@/hooks/useOrders';
import { initializeRazorpay, RAZORPAY_KEY_ID } from '@/lib/razorpay';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const createOrder = useCreateOrder();
  const createPayment = useCreatePayment();
  const verifyPayment = useVerifyPayment();

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const validateForm = () => {
    const requiredFields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(
      (field) => !shippingAddress[field as keyof typeof shippingAddress]
    );

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return false;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(shippingAddress.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      toast.error('Please enter a valid 6-digit PIN code');
      return false;
    }

    return true;
  };

  const handleRazorpayPayment = async (orderId: string) => {
    try {
      // Create Razorpay order
      const paymentData = await createPayment.mutateAsync(orderId);

      // Initialize Razorpay checkout
      initializeRazorpay(
        {
          id: paymentData.id,
          amount: paymentData.amount,
          currency: paymentData.currency,
        },
        {
          name: shippingAddress.fullName,
          email: user?.email || '',
          phone: shippingAddress.phone,
        },
        async (response) => {
          // Verify payment
          try {
            await verifyPayment.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success('Payment successful!', {
              description: 'Your order has been confirmed.',
            });
            clearCart();
            navigate('/orders');
          } catch (error) {
            toast.error('Payment verification failed', {
              description: 'Please contact support if amount was deducted.',
            });
          }
          setIsProcessing(false);
        },
        () => {
          setIsProcessing(false);
          toast.info('Payment cancelled');
        }
      );
    } catch (error) {
      setIsProcessing(false);
      toast.error('Failed to initiate payment');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);

    try {
      // Create order
      const order = await createOrder.mutateAsync({
        shippingAddress,
        paymentMethod,
      });

      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment(order._id);
      } else {
        // COD order
        toast.success('Order placed successfully!', {
          description: 'Pay when you receive your order.',
        });
        clearCart();
        navigate('/orders');
        setIsProcessing(false);
      }
    } catch (error) {
      setIsProcessing(false);
      toast.error('Failed to place order', {
        description: 'Please try again.',
      });
    }
  };

  const subtotal = getTotalPrice();
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {!RAZORPAY_KEY_ID && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Razorpay is not configured. Please set VITE_RAZORPAY_KEY_ID environment variable.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Shipping Address */}
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-2xl bg-card p-6 neumorphic">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary">
                    <MapPin className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-bold">Shipping Address</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      className="bg-secondary border-0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      className="bg-secondary border-0"
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      placeholder="House/Flat No., Building, Street"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                      className="bg-secondary border-0"
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      placeholder="Landmark, Area (Optional)"
                      value={shippingAddress.addressLine2}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="bg-secondary border-0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="bg-secondary border-0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      placeholder="6-digit PIN code"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      className="bg-secondary border-0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl bg-card p-6 neumorphic">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary">
                    <CreditCard className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-bold">Payment Method</h2>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-3 rounded-xl bg-secondary/50 p-4">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                      <span className="font-medium">Razorpay</span>
                      <p className="text-sm text-muted-foreground">
                        Pay securely with UPI, Cards, Net Banking
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-xl bg-secondary/50 p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-sm text-muted-foreground">
                        Pay when you receive your order
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-card p-6 neumorphic">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (18% GST)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 gradient-primary border-0"
                  size="lg"
                  disabled={isProcessing || (paymentMethod === 'razorpay' && !RAZORPAY_KEY_ID)}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
