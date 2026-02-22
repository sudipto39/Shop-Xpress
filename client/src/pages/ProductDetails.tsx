import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus, Star, Truck, Shield, ArrowLeft, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartStore } from '@/stores/cartStore';
import { useProduct } from '@/hooks/useProducts';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, isLoading, error } = useProduct(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-10 w-56" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-2">Product not found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Button asChild className="gradient-primary border-0">
          <Link to="/">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const images = product.images || [product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      image: images[0],
    }, quantity);
    toast.success('Added to cart!', {
      description: `${quantity} x ${product.name}`,
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span>/</span>
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/?category=${product.category}`} className="hover:text-foreground transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted neumorphic">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {discount > 0 && (
                <Badge variant="destructive" className="absolute left-4 top-4">
                  {discount}% OFF
                </Badge>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all ${
                      selectedImage === index
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {product.category}
              </p>
              <h1 className="mt-2 text-3xl font-bold lg:text-4xl">{product.name}</h1>
              
              {/* Rating */}
              {product.rating && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating!)
                            ? 'fill-chart-4 text-chart-4'
                            : 'fill-muted text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({product.numReviews || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              {discount > 0 && (
                <Badge className="gradient-primary border-0">Save {discount}%</Badge>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <Separator />

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 rounded-xl bg-secondary p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="flex-1 gradient-primary border-0"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 ${isWishlisted ? 'text-accent' : ''}`}
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                }}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-chart-4' : 'bg-destructive'}`} />
              <span className="text-sm">
                {product.stock > 10
                  ? 'In Stock'
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Features */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-4">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">Orders over ₹999</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-4">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">1 Year Warranty</p>
                  <p className="text-xs text-muted-foreground">Full coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="w-full justify-start border-b bg-transparent p-0">
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent px-6 pb-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent px-6 pb-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Reviews ({product.numReviews || 0})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="specifications" className="mt-8">
              <div className="rounded-2xl bg-card p-6 neumorphic-sm">
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between border-b border-border py-3 last:border-0">
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No specifications available</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-8">
              <div className="rounded-2xl bg-card p-6 neumorphic-sm text-center">
                <p className="text-muted-foreground">Reviews will be loaded from your backend API</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
