import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import instance from '../utils/axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) { 
      // Load guest cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      setItems(guestCart);
      setLoading(false); 
      return; 
    }

    const mergeGuestCart = async () => {
      const guest = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      if (guest.length === 0) {
        reloadCartFromServer();
        return;
      }
      
      try {
        for (const it of guest) {
          if (it.product && it.product._id && it.size && it.quantity) {
            await instance.post('/cart/add', { productId: it.product._id, size: it.size, quantity: it.quantity });
          }
        }
        localStorage.removeItem('guest_cart');
        toast.success('Guest cart items merged successfully');
      } catch (error) {
        console.error('Error merging guest cart:', error);
        toast.error('Some items could not be merged from guest cart');
      }
      
      reloadCartFromServer();
    };

    mergeGuestCart();
  }, [isAuthenticated]);

  const reloadCartFromServer = () => {
    instance.get('/cart').then(response => {
      setItems(response.data.items ?? response.data);
    }).catch(error => {
      toast.error('Failed to load cart');
    }).finally(() => {
      setLoading(false);
    });
  };

  const calculateTotal = (cartItems) => {
    try {
      const sum = cartItems.reduce((acc, item) => {
        if (!item.product || typeof item.product.price !== 'number' || !item.quantity) {
          console.error('Invalid cart item:', item);
          return acc;
        }
        return acc + (item.product.price * item.quantity);
      }, 0);
      return sum;
    } catch (error) {
      console.error('Failed to calculate total:', error);
      return 0;
    }
  };

  const addItem = async (product, size, quantity = 1) => {
    if (!product || !product._id || !size || quantity < 1) {
      toast.error('Invalid product information');
      return;
    }

    if (!isAuthenticated) {
      // Handle guest cart storage
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const existingItem = guestCart.find(item => item.product._id === product._id && item.size === size);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        guestCart.push({ product, size, quantity });
      }
      
      localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      setItems(guestCart);
      toast.success('Item added to cart successfully');
      return;
    }

    try {
      const response = await instance.post('/cart/add', { productId: product._id, size, quantity });
      setItems(response.data.items ?? response.data);
      toast.success('Item added to cart successfully');
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const removeItem = async (productId, size) => {
    if (!productId || !size) {
      toast.error('Invalid item information');
      return;
    }

    if (!isAuthenticated) {
      // Handle guest cart removal
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const updatedCart = guestCart.filter(item => !(item.product._id === productId && item.size === size));
      localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
      setItems(updatedCart);
      toast.success('Item removed from cart successfully');
      return;
    }

    try {
      const response = await instance.post('/cart/remove', { productId, size });
      setItems(response.data.items ?? response.data);
      toast.success('Item removed from cart successfully');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (productId, size, quantity) => {
    if (!productId || !size || quantity < 1) {
      toast.error('Invalid update information');
      return;
    }

    if (!isAuthenticated) {
      // Handle guest cart quantity update
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const item = guestCart.find(item => item.product._id === productId && item.size === size);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
        setItems(guestCart);
        toast.success('Quantity updated successfully');
      } else {
        toast.error('Item not found in cart');
      }
      return;
    }

    try {
      const response = await instance.post('/cart/update', { productId, size, quantity });
      setItems(response.data.items ?? response.data);
      toast.success('Quantity updated successfully');
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      // Handle guest cart clearing
      localStorage.removeItem('guest_cart');
      setItems([]);
      toast.success('Cart cleared successfully');
      return;
    }

    try {
      const response = await instance.post('/cart/clear');
      setItems(response.data.items ?? response.data);
      toast.success('Cart cleared successfully');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const clearLocal = () => {
    // Clear local cart state without server call
    setItems([]);
    localStorage.removeItem('guest_cart');
    // No toast message as this is called during logout
  };

  const value = {
    items,
    total: calculateTotal(items),
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    clearLocal,
    itemCount: items.length
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 