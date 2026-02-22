import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  category: string;
  rating?: number;
  numReviews?: number;
  stock?: number;
  totalStock?: number;
  isFeatured?: boolean;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const productImage = product.image || (product.images && product.images[0]) || '/placeholder.svg';
  const productStock = product.stock ?? product.totalStock ?? 0;
  const productFeatured = product.isFeatured ?? product.featured ?? false;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      _id: product._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      image: productImage,
    });
    toast.success('Added to cart!', {
      description: product.name,
    });
  };

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="overflow-hidden rounded-2xl bg-card neumorphic transition-all duration-300 hover:glow-primary">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={productImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {productFeatured && (
              <Badge className="gradient-primary border-0">Featured</Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive">{discount}% OFF</Badge>
            )}
          </div>
          {/* Wishlist Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-3 top-3 h-9 w-9 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.success('Added to wishlist!');
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-background/90 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
            <Button
              onClick={handleAddToCart}
              className="w-full gradient-primary border-0"
              disabled={productStock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {productStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
          <h3 className="mt-1 font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.rating && (
            <div className="mt-2 flex items-center gap-1">
              <Star className="h-4 w-4 fill-chart-4 text-chart-4" />
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({product.numReviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
