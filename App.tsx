/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PromoBanner from './components/PromoBanner';
import Hero from './components/Hero';
import Features from './components/Features';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import AdminDashboard from './components/AdminDashboard';
import ReviewsSection from './components/ReviewsSection';
import OfferBanner from './components/OfferBanner';
import About from './components/About';
import Footer from './components/Footer';
import Assistant from './components/Assistant';

import { 
  Product, 
  StoreSettings, 
  Order, 
  Review, 
  CartItem, 
  ViewState, 
  ProductCategory, 
  OrderStatus 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SETTINGS, 
  INITIAL_REVIEWS 
} from './constants';

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-1092',
    orderNumber: '1092',
    createdAt: 'اليوم، 02:40 م',
    customerName: 'أم مريم عبد الرحمن',
    phone: '01012345678',
    phoneSecondary: '01198765432',
    governorate: 'القاهرة',
    cityAndArea: 'مدينة نصر - المنطقة الأولى',
    detailedAddress: 'شارع الطيران، عمارة 14، الدور الثالث، شقة 6 بجوار مسجد الإيمان',
    notes: 'طولي 163 سم، أرجو أن يكون الإدناء فضفاضاً وسابغاً جداً',
    items: [
      {
        id: 'cart-sample-1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedColor: { name: 'أسود فحمي ملكي', hex: '#111111' },
        selectedSize: 'مقاس 2 (طول 163-170 سم)'
      },
      {
        id: 'cart-sample-2',
        product: INITIAL_PRODUCTS[4],
        quantity: 1,
        selectedColor: { name: 'أسود سواد الليل', hex: '#0B0B0B' },
        selectedSize: 'طول سابغ طويل (55 سم)'
      }
    ],
    subtotal: 810,
    shippingCost: 0,
    isShippingFree: true,
    total: 810,
    depositRequired: 100,
    depositPaidReported: 100,
    remainingAmount: 710,
    depositMethod: 'إنستاباي (InstaPay)',
    depositSenderNumber: 'maryam.ahmed@instapay',
    depositScreenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
    status: 'pending'
  }
];

function App() {
  // Persistence with LocalStorage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('algaber_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('algaber_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        const contactPhone = (!parsed.contactPhone || parsed.contactPhone === '01108372315')
          ? '01033277866'
          : parsed.contactPhone;
        const whatsappNumber = (!parsed.whatsappNumber || parsed.whatsappNumber === '201108372315')
          ? '201033277866'
          : parsed.whatsappNumber;

        // Ensure payment methods have 01033277866
        const paymentMethods = (parsed.paymentMethods && parsed.paymentMethods.length > 0)
          ? parsed.paymentMethods.map((pm: any) => {
              if (pm.number === '01108372315' || !pm.number) {
                return { 
                  ...pm, 
                  number: '01033277866',
                  instructions: pm.instructions?.replace(/01108372315/g, '01033277866') || pm.instructions
                };
              }
              return pm;
            })
          : INITIAL_SETTINGS.paymentMethods;

        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          contactPhone,
          whatsappNumber,
          paymentMethods,
          siteImages: {
            ...INITIAL_SETTINGS.siteImages,
            ...(parsed.siteImages || {}),
            logoUrl: (parsed.siteImages?.logoUrl && !parsed.siteImages.logoUrl.includes('unsplash')) 
              ? parsed.siteImages.logoUrl 
              : '/logo.jpg',
            heroBannerUrl: (parsed.siteImages?.heroBannerUrl && !parsed.siteImages.heroBannerUrl.includes('unsplash'))
              ? parsed.siteImages.heroBannerUrl
              : '/banner.jpg'
          },
          provinceRates: parsed.provinceRates || INITIAL_SETTINGS.provinceRates
        };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('algaber_orders');
      return saved ? JSON.parse(saved) : SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('algaber_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('algaber_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('algaber_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('algaber_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('algaber_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // View state & navigation
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [externalOmarPrompt, setExternalOmarPrompt] = useState<string | null>(null);

  // Cart total calculations
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Cart operations
  const addToCart = (
    product: Product, 
    selectedColor: { name: string; hex: string }, 
    selectedSize: string, 
    quantity: number
  ) => {
    const existingIndex = cartItems.findIndex(
      item => item.product.id === product.id && 
              item.selectedColor.name === selectedColor.name && 
              item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        selectedColor,
        selectedSize
      };
      setCartItems([...cartItems, newItem]);
    }
    setIsCartOpen(true);
  };

  const handleQuickAddToCart = (product: Product) => {
    const defaultColor = product.colors[0] || { name: 'أسود ملكي', hex: '#111111' };
    const defaultSize = product.sizes[0] || 'فري سايز';
    addToCart(product, defaultColor, defaultSize, 1);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Direct checkout
  const handleDirectCheckout = (
    product: Product, 
    selectedColor: { name: string; hex: string }, 
    selectedSize: string, 
    quantity: number
  ) => {
    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      quantity,
      selectedColor,
      selectedSize
    };
    setCartItems([newItem]);
    setView({ type: 'checkout' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order submission
  const handleOrderSubmitted = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setCartItems([]);
    setView({ type: 'order_success', order: newOrder });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('هل أنتِ متأكدة من حذف هذا الطلب نهائياً؟')) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts([newProd, ...products]);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('هل أنتِ متأكدة من حذف هذا الموديل؟')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleAddReview = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  // Navigation helper
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (view.type !== 'home') {
      setView({ type: 'home' });
      setTimeout(() => scrollToSection(targetId), 50);
    } else {
      scrollToSection(targetId);
    }
  };

  const scrollToSection = (targetId: string) => {
    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2421] selection:bg-[#DFBD69]/30 selection:text-[#121316] flex flex-col justify-between">
      
      {/* View routing */}
      {view.type === 'admin' ? (
        <AdminDashboard
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          settings={settings}
          onUpdateSettings={(newSettings) => setSettings(newSettings)}
          reviews={reviews}
          onDeleteReview={handleDeleteReview}
          onAddReview={handleAddReview}
          onClose={() => setView({ type: 'home' })}
        />
      ) : (
        <>
          {/* Top Promotional Bar for Shipping & Discounts */}
          <PromoBanner 
            settings={settings}
            onViewOffersClick={() => {
              if (view.type !== 'home') setView({ type: 'home' });
              setSelectedCategory('all');
              setTimeout(() => scrollToSection('products'), 50);
            }}
          />

          {/* Main Navigation */}
          <Navbar 
            onNavClick={handleNavClick}
            cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            cartTotal={cartTotal}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAdmin={() => setView({ type: 'admin' })}
            onCategorySelect={(cat) => {
              setSelectedCategory(cat);
              if (view.type !== 'home') setView({ type: 'home' });
            }}
            settings={settings}
          />

          <main className="flex-1">
            {/* HOME VIEW */}
            {view.type === 'home' && (
              <>
                <Hero 
                  settings={settings}
                  onExploreClick={() => scrollToSection('products')}
                  onOffersClick={() => {
                    setSelectedCategory('all');
                    scrollToSection('products');
                  }}
                  onAskOmarClick={() => setExternalOmarPrompt('ما هي أفضل الموديلات المناسبة للاستخدام اليومي في متجر آل جابر؟')}
                />

                <Features settings={settings} />

                {/* Promotional Offer Banner (Customizable from Admin) */}
                <OfferBanner 
                  settings={settings}
                  onExploreOffers={() => {
                    setSelectedCategory('all');
                    scrollToSection('products');
                  }}
                />

                <ProductGrid 
                  products={products}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onProductClick={(p) => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setView({ type: 'product', product: p });
                  }}
                  onAddToCart={handleQuickAddToCart}
                />

                <ReviewsSection reviews={reviews} />

                <About settings={settings} />
              </>
            )}

            {/* PRODUCT DETAIL VIEW */}
            {view.type === 'product' && (
              <ProductDetail 
                product={view.product}
                onBack={() => {
                  setView({ type: 'home' });
                  setTimeout(() => scrollToSection('products'), 50);
                }}
                onAddToCart={(prod, col, sz, qty) => addToCart(prod, col, sz, qty)}
                onDirectCheckout={(prod, col, sz, qty) => handleDirectCheckout(prod, col, sz, qty)}
                onAskOmar={(prompt) => setExternalOmarPrompt(prompt || null)}
                settings={settings}
                reviews={reviews}
                onAddReview={(newRev) => handleAddReview({
                  ...newRev,
                  id: `rev-${Date.now()}`,
                  date: 'اليوم',
                  verified: true
                })}
              />
            )}

            {/* CHECKOUT VIEW */}
            {view.type === 'checkout' && (
              <Checkout 
                items={cartItems}
                settings={settings}
                onBack={() => setView({ type: 'home' })}
                onOrderSuccess={handleOrderSubmitted}
              />
            )}

            {/* ORDER SUCCESS VIEW */}
            {view.type === 'order_success' && (
              <OrderSuccess 
                order={view.order}
                settings={settings}
                onBackToHome={() => setView({ type: 'home' })}
              />
            )}
          </main>

          {/* Footer */}
          <Footer 
            settings={settings}
            onLinkClick={handleNavClick}
            onCategoryClick={(cat) => {
              setSelectedCategory(cat);
              if (view.type !== 'home') setView({ type: 'home' });
              setTimeout(() => scrollToSection('products'), 50);
            }}
            onOpenAdmin={() => setView({ type: 'admin' })}
          />

          {/* Omar AI Bot Assistant */}
          <Assistant 
            products={products}
            settings={settings}
            externalPrompt={externalOmarPrompt}
            onClearExternalPrompt={() => setExternalOmarPrompt(null)}
          />

          {/* Cart Drawer */}
          <CartDrawer 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={() => {
              setIsCartOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'checkout' });
            }}
            settings={settings}
          />
        </>
      )}

    </div>
  );
}

export default App;
