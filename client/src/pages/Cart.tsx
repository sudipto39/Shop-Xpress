import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { Separator } from '@/components/ui/separator';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="rounded-full bg-muted p-8 mb-6">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added any products yet.</p>
        <Button asChild className="gradient-primary border-0">
          <Link to="/">
            Start Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 rounded-2xl bg-card p-4 neumorphic-sm sm:p-6"
              >
                <Link
                  to={`/product/${item.productId}`}
                  className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-32"
                >
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-semibold hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-lg font-bold text-primary">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-xl bg-secondary p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-card p-6 neumorphic">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)
                  </span>
                  <span>₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-success font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
              <Button asChild className="w-full mt-6 gradient-primary border-0" size="lg">
                <Link to="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full mt-3">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
