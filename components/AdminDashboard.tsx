/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { 
  Order, 
  Product, 
  StoreSettings, 
  Review, 
  OrderStatus, 
  ProductCategory,
  ProvinceShippingRate,
  SiteVisitor
} from '../types';
import { DEFAULT_PROVINCE_RATES, INITIAL_SETTINGS } from '../constants';
import { 
  Lock, 
  Package, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  Star, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Eye, 
  X, 
  Save, 
  LogOut, 
  Phone, 
  MessageSquare,
  Sparkles,
  Search,
  Tag,
  ImageIcon,
  Upload,
  RefreshCw,
  Users,
  UserPlus,
  Download,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;

  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;

  reviews: Review[];
  onDeleteReview: (reviewId: string) => void;
  onAddReview: (review: Review) => void;

  visitors?: SiteVisitor[];
  onDeleteVisitor?: (visitorId: string) => void;
  onAddVisitor?: (visitor: SiteVisitor) => void;
  onClearVisitors?: () => void;

  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  settings,
  onUpdateSettings,
  reviews,
  onDeleteReview,
  onAddReview,
  visitors = [],
  onDeleteVisitor,
  onAddVisitor,
  onClearVisitors,
  onClose
}) => {
  // Authentication state (Strictly confidential password)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'images' | 'products' | 'shipping' | 'deposit' | 'reviews' | 'visitors'>('orders');

  // Filter state for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Visitor section state
  const [visitorSearch, setVisitorSearch] = useState('');
  const [isAddVisitorModalOpen, setIsAddVisitorModalOpen] = useState(false);
  const [newVisitorName, setNewVisitorName] = useState('');
  const [newVisitorNotes, setNewVisitorNotes] = useState('');

  // Preview screenshot modal
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);

  // Settings form local state
  const [localSettings, setLocalSettings] = useState<StoreSettings>({ ...settings });
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  // Selected product for quick image edit in Images tab
  const [quickImageProductId, setQuickImageProductId] = useState(products[0]?.id || '');

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    tagline: '',
    category: 'ednaa',
    price: 500,
    originalPrice: 650,
    isOnSale: false,
    saleTag: 'عرض خاص',
    fabric: 'كريب رويال فاخر',
    description: '',
    features: ['خامة عالية الجودة', 'مقاس واسع وساتر'],
    colors: [{ name: 'أسود ملكي', hex: '#111111' }, { name: 'كحلي داكن', hex: '#1E293B' }],
    sizes: ['مقاس 1 (155-162 سم)', 'مقاس 2 (163-170 سم)'],
    imageUrl: '/banner.jpg',
    gallery: ['/banner.jpg'],
    inStock: true,
    rating: 5,
    reviewsCount: 1
  });

  // Review Form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewProduct, setNewReviewProduct] = useState(products[0]?.id || '');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Province Rates management handlers
  const handleUpdateProvinceRate = (id: string, updates: Partial<ProvinceShippingRate>) => {
    const currentRates = localSettings.provinceRates || DEFAULT_PROVINCE_RATES;
    const newRates = currentRates.map(r => r.id === id ? { ...r, ...updates } : r);
    setLocalSettings({ ...localSettings, provinceRates: newRates });
  };

  const handleResetProvinceRates = () => {
    setLocalSettings({ ...localSettings, provinceRates: DEFAULT_PROVINCE_RATES });
  };

  const handleAddProvinceRate = () => {
    const currentRates = localSettings.provinceRates || DEFAULT_PROVINCE_RATES;
    const newRate: ProvinceShippingRate = {
      id: `custom-rate-${Date.now()}`,
      regionName: 'منطقة جديدة',
      governorates: ['منطقة جديدة'],
      price: 100,
      deliveryTime: 'خلال 36 ساعة',
      maxWeightAllowedKg: 1,
      extraKgPrice: 5
    };
    setLocalSettings({ ...localSettings, provinceRates: [...currentRates, newRate] });
  };

  const handleDeleteProvinceRate = (id: string) => {
    const currentRates = localSettings.provinceRates || DEFAULT_PROVINCE_RATES;
    setLocalSettings({ ...localSettings, provinceRates: currentRates.filter(r => r.id !== id) });
  };

  // Password check handler (Never reveal the password!)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPassword === settings.adminPassword || enteredPassword === 'omar777') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('كلمة المرور غير صحيحة، يرجى المحاولة مجدداً.');
    }
  };

  // Status badge styling
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg text-xs font-bold">بانتظار مراجعة العربون</span>;
      case 'deposit_confirmed':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg text-xs font-bold">تم تأكيد العربون ✓</span>;
      case 'processing':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg text-xs font-bold">جاري تجهيز الموديل</span>;
      case 'shipped':
        return <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-lg text-xs font-bold">تم الشحن مع المندوب</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-bold">تم التوصيل بنجاح ✓✓</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-lg text-xs font-bold">طلب ملغي</span>;
    }
  };

  // Helper for uploading file to Data URL
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onSuccess(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.phone.includes(q) || o.depositSenderNumber.includes(q);
      const matchNumber = o.orderNumber.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchNumber) return false;
    }
    return true;
  });

  // Handle open product modal
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      tagline: '',
      category: 'ednaa',
      price: 500,
      originalPrice: 650,
      isOnSale: false,
      saleTag: 'عرض خاص',
      fabric: 'كريب رويال فاخر',
      description: '',
      features: ['خامة كريب عالية الجودة', 'مقاس واسع وساتر'],
      colors: [{ name: 'أسود ملكي', hex: '#111111' }, { name: 'كحلي داكن', hex: '#1E293B' }],
      sizes: ['مقاس 1 (طول 155-162 سم)', 'مقاس 2 (طول 163-170 سم)'],
      imageUrl: '/banner.jpg',
      gallery: ['/banner.jpg'],
      inStock: true,
      rating: 5,
      reviewsCount: 1
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProductId) {
      onUpdateProduct({
        ...(productForm as Product),
        id: editingProductId
      });
    } else {
      const newId = `prod-${Date.now()}`;
      onAddProduct({
        ...(productForm as Product),
        id: newId
      });
    }
    setIsProductModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSettingsSavedAlert(true);
    setTimeout(() => setSettingsSavedAlert(false), 3000);
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;

    const prod = products.find(p => p.id === newReviewProduct) || products[0];
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: prod ? prod.id : 'general',
      productName: prod ? prod.name : 'موديل آل جابر',
      authorName: newReviewAuthor,
      rating: newReviewRating,
      comment: newReviewComment,
      date: 'اليوم',
      verified: true
    };
    onAddReview(newRev);
    setNewReviewAuthor('');
    setNewReviewComment('');
  };

  // If not authenticated, show secure password screen (no password leak)
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#14161A] border-2 border-[#C5A059]/40 rounded-3xl p-8 max-w-md w-full shadow-2xl text-right animate-fadeIn text-white">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#DFBD69] to-[#997A2E] text-[#121316] flex items-center justify-center mx-auto mb-5 shadow-gold">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F3E5AB] text-center mb-1">
            لوحة إدارة {settings.brandName}
          </h2>
          <p className="text-xs text-gray-300 text-center mb-6">
            يرجى إدخال كلمة مرور الإدارة للمتابعة
          </p>

          {authError && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl text-xs font-semibold mb-4 text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-200 block mb-1">كلمة المرور:</label>
              <input
                type="password"
                required
                autoFocus
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="أدخل كلمة المرور هنا..."
                className="w-full p-3 bg-white/10 border border-[#C5A059]/40 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#DFBD69]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#DFBD69] hover:from-[#DFBD69] hover:to-[#F3E5AB] text-[#121316] rounded-xl font-bold text-sm shadow-gold transition-all"
            >
              تسجيل الدخول إلى لوحة التحكم
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs text-gray-400 hover:text-white font-semibold transition-colors"
            >
              الرجوع إلى المتجر
            </button>
          </form>

        </div>
      </div>
    );
  }

  // Calculate quick stats
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const totalSalesRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const totalDepositsCollected = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.depositPaidReported, 0);

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-right font-sans pb-16">
      
      {/* Top Admin Bar */}
      <header className="bg-[#121316] text-[#FAF8F5] py-4 px-4 sm:px-8 border-b border-[#C5A059]/30 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#C5A059] shadow-gold bg-[#0C0D0F]">
              <img src={localSettings.siteImages?.logoUrl || '/logo.jpg'} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-base sm:text-lg text-[#F3E5AB]">
                لوحة تحكم إدارة {settings.brandName}
              </h1>
              <span className="text-[11px] text-[#C5A059] font-semibold">
                مسؤول النظام • {settings.brandSlogan || 'أناقة الالتزام.. وجمال التراث'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#FAF8F5] rounded-lg text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>قفل اللوحة</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#C5A059] to-[#DFBD69] text-[#121316] rounded-lg text-xs font-bold transition-all shadow-gold"
            >
              <span>معاينة المتجر</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E8E1D3] shadow-xs">
            <span className="text-xs text-[#716B5E] block font-medium">إجمالي الطلبات</span>
            <span className="text-2xl font-bold text-[#18231C] font-mono mt-1 block">
              {totalOrdersCount} طلب
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8E1D3] shadow-xs">
            <span className="text-xs text-[#716B5E] block font-medium">بانتظار تأكيد العربون</span>
            <span className="text-2xl font-bold text-amber-600 font-mono mt-1 block">
              {pendingOrdersCount} طلب
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8E1D3] shadow-xs">
            <span className="text-xs text-[#716B5E] block font-medium">العربين المستلمة</span>
            <span className="text-2xl font-bold text-[#997A2E] font-mono mt-1 block">
              {totalDepositsCollected} ج.م
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8E1D3] shadow-xs">
            <span className="text-xs text-[#716B5E] block font-medium">إجمالي المبيعات</span>
            <span className="text-2xl font-bold text-[#18231C] font-mono mt-1 block">
              {totalSalesRevenue} ج.م
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('visitors')}
            className="bg-white p-5 rounded-2xl border border-[#E8E1D3] shadow-xs cursor-pointer hover:border-[#C5A059] transition-all"
            title="انقر للانتقال إلى قسم الزوار"
          >
            <span className="text-xs text-[#716B5E] block font-medium flex items-center justify-between">
              <span>زوار المتجر المسجلين</span>
              <span className="text-[10px] text-[#C5A059] font-bold">عرض ←</span>
            </span>
            <span className="text-2xl font-bold text-[#18231C] font-mono mt-1 block">
              {visitors.length} زائر
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E0D7C4]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#121316] text-[#F3E5AB] border border-[#C5A059] shadow-gold'
                : 'bg-white text-[#524E46] hover:bg-[#EFE9DD] border border-[#E0D7C4]'
            }`}
          >
            <Package className="w-4 h-4 text-[#DFBD69]" />
            <span>إدارة الطلبات والعربون ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === 'images'
                ? 'bg-[#121316] text-[#F3E5AB] border border-[#C5A059] shadow-gold'
                : 'bg-white text-[#524E46] hover:bg-[#EFE9DD] border border-[#E0D7C4]'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#DFBD69]" />
            <span>إدارة الصور والبانرات واللوجو 🔥</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#121316] text-[#F3E5AB] border border-[#C5A059] shadow-gold'
                : 'bg-white text-[#524E46] hover:bg-[#EFE9DD] border border-[#E0D7C4]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#DFBD69]" />
            <span>الموديلات والمنتجات ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'bg-[#121316] text-[#F3E5AB] border border-[#C5A059] shadow-gold'
                : 'bg-white text-[#524E46] hover:bg-[#EFE9DD] border border-[#E0D7C4]'
            }`}
          >
            <Truck className="w-4 h-4 text-[#DFBD69]" />
            <span>عروض الشحن والتوصيل</span>
          </button>

          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === 'deposit'
                ? 'bg-[#121316] text-[#F3E5AB] border border-[#C5A059] shadow-gold'
                : 'bg-white text-[#524E46] hover:bg-[#EFE9DD] border border-[#E0D7C4]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#DFBD69]" />
            <span>إعدادات العربون والحسابات</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-[#121316] text-[#F3E5AB] border border-[#C5A059] shadow-gold'
                : 'bg-white text-[#524E46] hover:bg-[#EFE9DD] border border-[#E0D7C4]'
            }`}
          >
            <Star className="w-4 h-4 text-[#DFBD69]" />
            <span>التقييمات والآراء ({reviews.length})</span>
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8E1D3] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setOrderStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    orderStatusFilter === 'all' ? 'bg-[#121316] text-[#F3E5AB]' : 'bg-[#FAF8F5] text-[#524E46]'
                  }`}
                >
                  الكل ({orders.length})
                </button>
                <button
                  onClick={() => setOrderStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    orderStatusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-[#FAF8F5] text-[#524E46]'
                  }`}
                >
                  قيد المراجعة ({orders.filter(o => o.status === 'pending').length})
                </button>
                <button
                  onClick={() => setOrderStatusFilter('deposit_confirmed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    orderStatusFilter === 'deposit_confirmed' ? 'bg-blue-600 text-white' : 'bg-[#FAF8F5] text-[#524E46]'
                  }`}
                >
                  تم تأكيد العربون
                </button>
                <button
                  onClick={() => setOrderStatusFilter('processing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    orderStatusFilter === 'processing' ? 'bg-purple-600 text-white' : 'bg-[#FAF8F5] text-[#524E46]'
                  }`}
                >
                  جاري التجهيز
                </button>
                <button
                  onClick={() => setOrderStatusFilter('delivered')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    orderStatusFilter === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-[#FAF8F5] text-[#524E46]'
                  }`}
                >
                  تم التوصيل
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="بحث باسم العميل، الهاتف، أو الطلب..."
                  className="w-full pr-8 pl-3 py-2 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs text-[#1F2D24] focus:outline-none focus:border-[#C5A059]"
                />
                <Search className="w-3.5 h-3.5 text-[#9C9484] absolute right-2.5 top-3" />
              </div>
            </div>

            {/* Orders Cards List */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E1D3] shadow-xs space-y-4 text-right"
                  >
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE1]">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-base text-[#997A2E]">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs text-[#8C8578]">{order.createdAt}</span>
                        {getStatusBadge(order.status)}
                      </div>

                      {/* Status changer dropdown */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <span className="text-xs font-bold text-[#1F2D24]">تغيير الحالة:</span>
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-[#FAF8F5] border border-[#DDD3BF] text-xs font-bold text-[#1F2D24] p-1.5 rounded-lg focus:outline-none focus:border-[#C5A059]"
                        >
                          <option value="pending">بانتظار مراجعة العربون</option>
                          <option value="deposit_confirmed">تم تأكيد العربون ✓</option>
                          <option value="processing">جاري تجهيز الموديل</option>
                          <option value="shipped">تم الشحن مع المندوب</option>
                          <option value="delivered">تم التوصيل بنجاح</option>
                          <option value="cancelled">إلغاء الطلب</option>
                        </select>

                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          className="p-1.5 text-[#A8A29E] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="حذف الطلب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Customer Info & Deposit Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Customer Info */}
                      <div className="md:col-span-5 bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE3D5] text-xs space-y-2">
                        <h4 className="font-bold text-xs text-[#18231C] pb-1 border-b border-[#DDD3BF]">
                          بيانات العميلة والتوصيل:
                        </h4>
                        <div>
                          <span className="text-[#787267]">الاسم: </span>
                          <strong className="text-[#1F2D24] text-sm">{order.customerName}</strong>
                        </div>
                        <div>
                          <span className="text-[#787267]">الهاتف: </span>
                          <strong className="text-[#121316] font-mono text-sm">{order.phone}</strong>
                          {order.phoneSecondary && (
                            <span className="text-[#787267]"> (بديل: {order.phoneSecondary})</span>
                          )}
                        </div>
                        <div>
                          <span className="text-[#787267]">المحافظة: </span>
                          <strong className="text-[#1F2D24]">{order.governorate} - {order.cityAndArea}</strong>
                        </div>
                        <div>
                          <span className="text-[#787267]">العنوان: </span>
                          <span className="text-[#1F2D24]">{order.detailedAddress}</span>
                        </div>
                        {order.notes && (
                          <div className="pt-1 text-[#8A7955] border-t border-[#E0D7C4]">
                            <span className="font-bold">ملاحظات خاصة: </span>
                            <span>{order.notes}</span>
                          </div>
                        )}

                        {/* WhatsApp Direct Chat Button */}
                        <a
                          href={`https://wa.me/20${order.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                            `السلام عليكم ورحمة الله أختنا الفاضلة ${order.customerName}، معكم إدارة متجر آل جابر للزي الشرعي بخصوص طلبكِ رقم #${order.orderNumber}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors mt-2"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>مراسلة واتساب</span>
                        </a>
                      </div>

                      {/* Deposit Verification & Screenshot */}
                      <div className="md:col-span-4 bg-[#FAF6ED] p-4 rounded-xl border border-[#E9DECA] text-xs space-y-2.5">
                        <h4 className="font-bold text-xs text-[#997A2E] pb-1 border-b border-[#E9DECA]">
                          فحص تحويل العربون:
                        </h4>

                        <div>
                          <span className="text-[#787267]">العربون المطلوب: </span>
                          <strong className="text-[#997A2E] text-sm">{order.depositRequired} ج.م</strong>
                        </div>

                        <div>
                          <span className="text-[#787267]">طريقة التحويل: </span>
                          <strong className="text-[#1F2D24]">{order.depositMethod}</strong>
                        </div>

                        <div>
                          <span className="text-[#787267]">الرقم المحول منه: </span>
                          <strong className="text-amber-800 font-mono text-sm bg-white px-2 py-0.5 rounded border border-[#DDD3BF]">
                            {order.depositSenderNumber}
                          </strong>
                        </div>

                        <div>
                          <span className="text-[#787267]">المتبقي عند الاستلام: </span>
                          <strong className="text-[#1F2D24] text-sm">{order.remainingAmount} ج.م كاش</strong>
                        </div>

                        {/* Screenshot thumbnail */}
                        <div className="pt-2 border-t border-[#E9DECA]">
                          <span className="text-[11px] font-bold text-[#1F2D24] block mb-1">
                            سكرين شوت التحويل:
                          </span>
                          {order.depositScreenshotUrl ? (
                            <div 
                              onClick={() => setPreviewScreenshotUrl(order.depositScreenshotUrl)}
                              className="relative cursor-pointer group rounded-lg overflow-hidden border border-[#DDD3BF] w-24 h-24 bg-white"
                            >
                              <img 
                                src={order.depositScreenshotUrl} 
                                alt="إشعار التحويل" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Eye className="w-4 h-4" />
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-red-600 font-semibold">لم يتم إرفاق صورة</span>
                          )}
                        </div>
                      </div>

                      {/* Items & Financials */}
                      <div className="md:col-span-3 bg-white p-3 rounded-xl border border-[#E8E1D3] text-xs space-y-2">
                        <h4 className="font-bold text-xs text-[#1F2D24] pb-1 border-b border-[#F0ECE1]">
                          الموديلات المطلوبة ({order.items.length}):
                        </h4>

                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="pb-1 border-b border-gray-100">
                              <p className="font-bold text-[#1F2D24] truncate">{item.product.name}</p>
                              <p className="text-[10px] text-[#787267]">
                                {item.selectedColor.name} | {item.selectedSize} × {item.quantity}
                              </p>
                              <p className="text-[11px] font-semibold text-[#997A2E]">
                                {item.product.price * item.quantity} ج.م
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-[#F0ECE1] space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span>الشحن:</span>
                            <span>{order.shippingCost === 0 ? 'مجاني' : `${order.shippingCost} ج.م`}</span>
                          </div>
                          <div className="flex justify-between font-bold text-xs text-[#121316]">
                            <span>إجمالي الأوردر:</span>
                            <span>{order.total} ج.م</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-[#E8E1D3] text-center text-[#716B5E] text-xs">
                لا توجد طلبات تطابق الفلتر الحالي.
              </div>
            )}

          </div>
        )}

        {/* TAB 2: IMAGES & BANNERS MANAGEMENT */}
        {activeTab === 'images' && (
          <div className="space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E1D3] shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#18231C]">
                  إدارة وتغيير كافة صور وبانرات الموقع
                </h3>
                <p className="text-xs text-[#716B5E] mt-1">
                  يمكنكِ رفع صور جديدة مباشرة من جهازكِ أو كتابة رابط الصورة لتغيير اللوجو والبانر الرئيسي وبانرات العروض
                </p>
              </div>

              {settingsSavedAlert && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ وتحديث صور وبانرات المتجر بنجاح!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-8">
                
                {/* 1. STORE LOGO */}
                <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D3] space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-[#18231C] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        <span>لوجو المتجر الرسمي (Logo)</span>
                      </h4>
                      <p className="text-xs text-[#716B5E] mt-0.5">
                        يظهر اللوجو في أعلى الموقع (النافيجيشن بار)، وبطاقات العرض، وأسفل المتجر (الفوتر).
                      </p>
                    </div>

                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#C5A059] shadow-gold bg-[#0C0D0F] shrink-0">
                      <img 
                        src={localSettings.siteImages?.logoUrl || '/logo.jpg'} 
                        alt="معاينة اللوجو" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8">
                      <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">رابط صورة اللوجو (URL):</label>
                      <input
                        type="text"
                        value={localSettings.siteImages?.logoUrl || ''}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          siteImages: { ...localSettings.siteImages, logoUrl: e.target.value }
                        })}
                        placeholder="/logo.jpg أو رابط خارجي..."
                        className="w-full p-2.5 bg-white border border-[#DDD3BF] rounded-xl text-xs font-mono text-[#1F2D24]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">أو ارفعي لوجو من جهازكِ:</label>
                      <label className="flex items-center justify-center gap-1.5 p-2.5 bg-white hover:bg-[#FAF6ED] border border-[#C5A059] text-[#997A2E] rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>اختيار صورة من الجهاز</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (dataUrl) => {
                            setLocalSettings({
                              ...localSettings,
                              siteImages: { ...localSettings.siteImages, logoUrl: dataUrl }
                            });
                          })}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. MAIN HERO BANNER */}
                <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D3] space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-[#18231C] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        <span>البانر الرئيسي للموقع (Hero Banner)</span>
                      </h4>
                      <p className="text-xs text-[#716B5E] mt-0.5">
                        البانر الملكي الكبير الذي يظهر في أعلى الصفحة الرئيسية بجانب العنوان والأسعار.
                      </p>
                    </div>

                    <div className="w-36 h-20 rounded-xl overflow-hidden border border-[#C5A059] shadow-xs shrink-0">
                      <img 
                        src={localSettings.siteImages?.heroBannerUrl || '/banner.jpg'} 
                        alt="معاينة البانر الرئيسي" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8">
                      <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">رابط صورة البانر (URL):</label>
                      <input
                        type="text"
                        value={localSettings.siteImages?.heroBannerUrl || ''}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          siteImages: { ...localSettings.siteImages, heroBannerUrl: e.target.value }
                        })}
                        placeholder="/banner.jpg أو رابط صورة..."
                        className="w-full p-2.5 bg-white border border-[#DDD3BF] rounded-xl text-xs font-mono text-[#1F2D24]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">أو ارفعي بانر من جهازكِ:</label>
                      <label className="flex items-center justify-center gap-1.5 p-2.5 bg-white hover:bg-[#FAF6ED] border border-[#C5A059] text-[#997A2E] rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>اختيار بانر من الجهاز</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (dataUrl) => {
                            setLocalSettings({
                              ...localSettings,
                              siteImages: { ...localSettings.siteImages, heroBannerUrl: dataUrl }
                            });
                          })}
                        />
                      </label>
                    </div>
                  </div>

                  {/* ALL TEXTS FOR HERO BANNER */}
                  <div className="pt-3 border-t border-[#EAE3D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#18231C] flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>تعديل كافة نصوص البانر الرئيسي:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setLocalSettings({
                            ...localSettings,
                            siteImages: {
                              ...localSettings.siteImages,
                              heroBannerBadge: INITIAL_SETTINGS.siteImages.heroBannerBadge,
                              heroBannerTitle: INITIAL_SETTINGS.siteImages.heroBannerTitle,
                              heroBannerHeadlineAccent: INITIAL_SETTINGS.siteImages.heroBannerHeadlineAccent,
                              heroBannerSubtitle: INITIAL_SETTINGS.siteImages.heroBannerSubtitle,
                              heroBannerCardTag: INITIAL_SETTINGS.siteImages.heroBannerCardTag,
                              heroBannerPrimaryBtnText: INITIAL_SETTINGS.siteImages.heroBannerPrimaryBtnText,
                              heroBannerSecondaryBtnText: INITIAL_SETTINGS.siteImages.heroBannerSecondaryBtnText,
                              heroBannerFeature1: INITIAL_SETTINGS.siteImages.heroBannerFeature1,
                              heroBannerFeature2: INITIAL_SETTINGS.siteImages.heroBannerFeature2,
                              heroBannerFeature3: INITIAL_SETTINGS.siteImages.heroBannerFeature3,
                            }
                          });
                        }}
                        className="text-[11px] text-[#997A2E] hover:underline font-bold"
                      >
                        استعادة النصوص الأصلية للبانر ↺
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">الشارة الترحيبية العلوية (Pill):</label>
                        <input
                          type="text"
                          value={localSettings.siteImages?.heroBannerBadge ?? ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            siteImages: { ...localSettings.siteImages, heroBannerBadge: e.target.value }
                          })}
                          placeholder="أناقة الالتزام.. وجمال التراث"
                          className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">العنوان الرئيسي الأول (اسم المتجر):</label>
                        <input
                          type="text"
                          value={localSettings.siteImages?.heroBannerTitle ?? ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            siteImages: { ...localSettings.siteImages, heroBannerTitle: e.target.value }
                          })}
                          placeholder="آل جابر للزي الشرعي"
                          className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">العنوان الذهبي المميز:</label>
                        <input
                          type="text"
                          value={localSettings.siteImages?.heroBannerHeadlineAccent ?? ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            siteImages: { ...localSettings.siteImages, heroBannerHeadlineAccent: e.target.value }
                          })}
                          placeholder="للزِّيِّ الشَّرْعِيِّ الفَاخِر"
                          className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-bold text-[#997A2E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">الوصف التفصيلي والترويجي للبانر:</label>
                      <textarea
                        rows={2}
                        value={localSettings.siteImages?.heroBannerSubtitle ?? ''}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          siteImages: { ...localSettings.siteImages, heroBannerSubtitle: e.target.value }
                        })}
                        placeholder="تشكيلة الزي الشرعي الفاخر بنقاء الخامات وعفة التصميم..."
                        className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">نص الزر الأساسي (تصفح):</label>
                        <input
                          type="text"
                          value={localSettings.siteImages?.heroBannerPrimaryBtnText ?? ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            siteImages: { ...localSettings.siteImages, heroBannerPrimaryBtnText: e.target.value }
                          })}
                          placeholder="تصفح أحدث الموديلات"
                          className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">نص الزر الثانوي (العروض):</label>
                        <input
                          type="text"
                          value={localSettings.siteImages?.heroBannerSecondaryBtnText ?? ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            siteImages: { ...localSettings.siteImages, heroBannerSecondaryBtnText: e.target.value }
                          })}
                          placeholder="عروض الموديلات والتخفيضات 🔥"
                          className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">شارة الكارت الصغير بالصورة:</label>
                        <input
                          type="text"
                          value={localSettings.siteImages?.heroBannerCardTag ?? ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            siteImages: { ...localSettings.siteImages, heroBannerCardTag: e.target.value }
                          })}
                          placeholder="مجموعة 2026"
                          className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">ميزة 1 (أسفل العنوان):</label>
                        <input
                          type="text"
                          value={localSettings.siteImages?.heroBannerFeature1 ?? ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            siteImages: { ...localSettings.siteImages, heroBannerFeature1: e.target.value }
                          })}
                          placeholder="كريب رويال نخب أول"
                          className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">ميزة 2 (الشحن):</label>
                        <input
                          type="text"
                          value={localSettings.siteImages?.heroBannerFeature2 ?? ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            siteImages: { ...localSettings.siteImages, heroBannerFeature2: e.target.value }
                          })}
                          placeholder="عروض شحن مجاني"
                          className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">ميزة 3 (العربون):</label>
                        <input
                          type="text"
                          value={localSettings.siteImages?.heroBannerFeature3 ?? ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            siteImages: { ...localSettings.siteImages, heroBannerFeature3: e.target.value }
                          })}
                          placeholder="عربون ميسر والباقي كاش"
                          className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. PROMOTIONAL OFFER BANNER */}
                <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D3] space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-[#18231C] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        <span>بانر العروض والتخفيضات (Offer Banner)</span>
                      </h4>
                      <p className="text-xs text-[#716B5E] mt-0.5">
                        البانر العريض الجذاب الذي يظهر في منتصف الصفحة للإعلان عن التخفيضات والشحن المجاني.
                      </p>
                    </div>

                    <div className="w-36 h-20 rounded-xl overflow-hidden border border-[#C5A059] shadow-xs shrink-0">
                      <img 
                        src={localSettings.siteImages?.promoBannerUrl || ''} 
                        alt="معاينة بانر العروض" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8">
                      <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">رابط صورة بانر العروض (URL):</label>
                      <input
                        type="text"
                        value={localSettings.siteImages?.promoBannerUrl || ''}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          siteImages: { ...localSettings.siteImages, promoBannerUrl: e.target.value }
                        })}
                        placeholder="رابط صورة بانر العروض..."
                        className="w-full p-2.5 bg-white border border-[#DDD3BF] rounded-xl text-xs font-mono text-[#1F2D24]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">أو ارفعي صورة من جهازكِ:</label>
                      <label className="flex items-center justify-center gap-1.5 p-2.5 bg-white hover:bg-[#FAF6ED] border border-[#C5A059] text-[#997A2E] rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>اختيار صورة من الجهاز</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (dataUrl) => {
                            setLocalSettings({
                              ...localSettings,
                              siteImages: { ...localSettings.siteImages, promoBannerUrl: dataUrl }
                            });
                          })}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">شارة العرض (Badge):</label>
                      <input
                        type="text"
                        value={localSettings.siteImages?.promoBannerBadge ?? ''}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          siteImages: { ...localSettings.siteImages, promoBannerBadge: e.target.value }
                        })}
                        placeholder="عرض موسمي مميز"
                        className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">عنوان بانر العروض:</label>
                      <input
                        type="text"
                        value={localSettings.siteImages?.promoBannerTitle ?? ''}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          siteImages: { ...localSettings.siteImages, promoBannerTitle: e.target.value }
                        })}
                        placeholder="عروض حصرية على الإدناءات والخمارات الملكية"
                        className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">نص زر تسوق العرض:</label>
                      <input
                        type="text"
                        value={localSettings.siteImages?.promoBannerBtnText ?? ''}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          siteImages: { ...localSettings.siteImages, promoBannerBtnText: e.target.value }
                        })}
                        placeholder="تسوقي العروض الآن"
                        className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">تفاصيل العرض الترويجي والخصومات:</label>
                    <input
                      type="text"
                      value={localSettings.siteImages?.promoBannerSubtitle ?? ''}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        siteImages: { ...localSettings.siteImages, promoBannerSubtitle: e.target.value }
                      })}
                      placeholder="خصومات تصل إلى 25% مع شحن مجاني لكافة المحافظات للطلبات المؤهلة..."
                      className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* 3B. TOP ANNOUNCEMENT BANNER */}
                <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D3] space-y-3">
                  <h4 className="font-bold text-sm text-[#18231C] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>شريط الإعلانات والشحن المجاني العلوي (Top Announcement Bar)</span>
                  </h4>
                  <p className="text-xs text-[#716B5E]">
                    الشريط الأسود والذهبي الذي يظهر في أعلى الموقع تماماً فوق القائمة الرئيسية.
                  </p>
                  <div>
                    <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">نص الإعلان العلوي:</label>
                    <input
                      type="text"
                      value={localSettings.siteImages?.topBarAnnouncementText ?? localSettings.shippingPromotionBannerText ?? ''}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        shippingPromotionBannerText: e.target.value,
                        siteImages: { ...localSettings.siteImages, topBarAnnouncementText: e.target.value }
                      })}
                      placeholder="✨ عرض حصري من آل جابر: شحن مجاني للطلبات بقيمة 750 ج.م فأكثر..."
                      className="w-full p-2.5 bg-white border border-[#DDD3BF] rounded-xl text-xs font-semibold text-[#18231C]"
                    />
                  </div>
                </div>

                {/* 4. ABOUT SECTION IMAGE */}
                <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D3] space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-[#18231C] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        <span>صورة قسم "عن آل جابر" (About Image)</span>
                      </h4>
                      <p className="text-xs text-[#716B5E] mt-0.5">
                        الصورة التي تظهر في قسم قصة المتجر ورسالة الزي الشرعي.
                      </p>
                    </div>

                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-[#C5A059] shadow-xs shrink-0">
                      <img 
                        src={localSettings.siteImages?.aboutImageUrl || ''} 
                        alt="معاينة صورة قسم من نحن" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8">
                      <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">رابط صورة قسم من نحن (URL):</label>
                      <input
                        type="text"
                        value={localSettings.siteImages?.aboutImageUrl || ''}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          siteImages: { ...localSettings.siteImages, aboutImageUrl: e.target.value }
                        })}
                        placeholder="رابط الصورة..."
                        className="w-full p-2.5 bg-white border border-[#DDD3BF] rounded-xl text-xs font-mono text-[#1F2D24]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">أو ارفعي صورة من جهازكِ:</label>
                      <label className="flex items-center justify-center gap-1.5 p-2.5 bg-white hover:bg-[#FAF6ED] border border-[#C5A059] text-[#997A2E] rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>اختيار صورة من الجهاز</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (dataUrl) => {
                            setLocalSettings({
                              ...localSettings,
                              siteImages: { ...localSettings.siteImages, aboutImageUrl: dataUrl }
                            });
                          })}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-gradient-to-r from-[#C5A059] to-[#DFBD69] hover:from-[#DFBD69] hover:to-[#F3E5AB] text-[#121316] rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-gold"
                  >
                    <Save className="w-4 h-4 text-[#121316]" />
                    <span>حفظ كافة تغييرات الصور والبانرات في الموقع</span>
                  </button>
                </div>

              </form>
            </div>

            {/* QUICK PRODUCT IMAGE UPDATER */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E1D3] shadow-xs space-y-5">
              <div>
                <h4 className="text-base font-serif font-bold text-[#18231C]">
                  تغيير صور الموديلات والمنتجات سريعاً
                </h4>
                <p className="text-xs text-[#716B5E] mt-0.5">
                  اختاري أي موديل لرفع صورة جديدة له فوراً
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="text-xs font-bold text-[#1F2D24] block mb-1">اختاري الموديل المراد تغيير صورته:</label>
                  <select
                    value={quickImageProductId}
                    onChange={(e) => setQuickImageProductId(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs font-bold text-[#1F2D24]"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.price} ج.م)</option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const targetProd = products.find(p => p.id === quickImageProductId);
                  if (!targetProd) return null;
                  return (
                    <div className="flex items-center gap-4 bg-[#FAF8F5] p-3 rounded-2xl border border-[#DDD3BF]">
                      <div className="w-14 h-16 rounded-xl overflow-hidden border border-[#C5A059] shrink-0">
                        <img src={targetProd.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#18231C] truncate">{targetProd.name}</p>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-1 bg-white hover:bg-[#FAF6ED] border border-[#C5A059] text-[#997A2E] rounded-lg text-[11px] font-bold cursor-pointer transition-colors shadow-2xs">
                          <Upload className="w-3 h-3" />
                          <span>رفع صورة جديدة لهذا الموديل</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (dataUrl) => {
                              onUpdateProduct({
                                ...targetProd,
                                imageUrl: dataUrl
                              });
                              alert(`تم تحديث صورة موديل "${targetProd.name}" بنجاح!`);
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#18231C]">
                  إدارة الموديلات والأقمشة
                </h3>
                <p className="text-xs text-[#716B5E] mt-0.5">
                  إضافة موديل جديد، تفعيل العروض، تعديل الأسعار، ومتابعة المخزون
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#DFBD69] text-[#121316] rounded-xl text-xs font-bold shadow-gold transition-all"
              >
                <Plus className="w-4 h-4 text-[#121316]" />
                <span>إضافة موديل جديد</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((prod) => (
                <div 
                  key={prod.id}
                  className="bg-white p-4 rounded-2xl border border-[#E8E1D3] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#F0ECE1] mb-3">
                      <img 
                        src={prod.imageUrl} 
                        alt={prod.name}
                        className="w-full h-full object-cover object-top"
                      />
                      {prod.isOnSale && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {prod.saleTag || 'خصم'}
                        </span>
                      )}
                      {!prod.inStock && (
                        <span className="absolute inset-0 bg-black/60 text-white text-xs font-bold flex items-center justify-center">
                          غير متوفر بالمخزن
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-sm text-[#18231C] mb-1">
                      {prod.name}
                    </h4>

                    <p className="text-xs text-[#716B5E] mb-2 font-medium">
                      الخامة: {prod.fabric}
                    </p>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-base font-bold text-[#997A2E]">
                        {prod.price} ج.م
                      </span>
                      {prod.isOnSale && prod.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {prod.originalPrice} ج.م
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="flex-1 py-1.5 px-3 bg-[#FAF8F5] hover:bg-[#F2EDE2] text-[#121316] rounded-lg text-xs font-bold border border-[#DDD3BF] flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل الموديل</span>
                    </button>

                    <button
                      onClick={() => onDeleteProduct(prod.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                      title="حذف الموديل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SHIPPING OFFERS & PROVINCE RATES */}
        {activeTab === 'shipping' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E1D3] shadow-xs space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#18231C]">
                  إعدادات وعروض الشحن وقائمة أسعار المحافظات
                </h3>
                <p className="text-xs text-[#716B5E] mt-1">
                  التحكم في أسعار شحن المحافظات (قيمة العربون)، مواعيد التسليم، وعروض الشحن المجاني
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetProvinceRates}
                  className="px-3 py-1.5 bg-[#FAF6ED] hover:bg-[#F0ECE1] text-[#997A2E] border border-[#DDD3BF] rounded-xl text-xs font-bold transition-colors"
                >
                  استعادة الأسعار الرسمية
                </button>
                <button
                  type="button"
                  onClick={handleAddProvinceRate}
                  className="px-3 py-1.5 bg-[#121316] text-[#F3E5AB] border border-[#C5A059] rounded-xl text-xs font-bold shadow-2xs hover:bg-[#1A1C22]"
                >
                  + إضافة منطقة
                </button>
              </div>
            </div>

            {settingsSavedAlert && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>تم حفظ إعدادات الشحن والعروض بنجاح!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Free shipping promotion toggle */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D3] flex items-center justify-between">
                <div>
                  <strong className="text-xs sm:text-sm font-bold text-[#1F2D24] block">
                    تفعيل عرض الشحن المجاني
                  </strong>
                  <span className="text-[11px] text-[#716B5E]">
                    إظهار إشعار الشحن المجاني للعملاء في السلة والشريط العلوي
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.isFreeShippingPromotionActive}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    isFreeShippingPromotionActive: e.target.checked
                  })}
                  className="w-5 h-5 accent-[#C5A059] cursor-pointer"
                />
              </div>

              {/* Free shipping promotion type */}
              {localSettings.isFreeShippingPromotionActive && (
                <div className="space-y-3 bg-[#FAF6ED] p-4 rounded-2xl border border-[#E9DECA]">
                  <label className="text-xs font-bold text-[#1F2D24] block">نوع عرض الشحن المجاني:</label>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs text-[#524E46] cursor-pointer">
                      <input
                        type="radio"
                        name="promoType"
                        checked={localSettings.freeShippingPromoType === 'threshold'}
                        onChange={() => setLocalSettings({
                          ...localSettings,
                          freeShippingPromoType: 'threshold'
                        })}
                        className="accent-[#C5A059]"
                      />
                      <span>شحن مجاني عند الشراء بمبلغ محدد أو أكثر</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-[#524E46] cursor-pointer">
                      <input
                        type="radio"
                        name="promoType"
                        checked={localSettings.freeShippingPromoType === 'all'}
                        onChange={() => setLocalSettings({
                          ...localSettings,
                          freeShippingPromoType: 'all'
                        })}
                        className="accent-[#C5A059]"
                      />
                      <span>شحن مجاني لكافة الطلبات والمحافظات دون حد أدنى!</span>
                    </label>
                  </div>

                  {localSettings.freeShippingPromoType === 'threshold' && (
                    <div className="pt-2">
                      <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                        الحد الأدنى للشحن المجاني (ج.م):
                      </label>
                      <input
                        type="number"
                        value={localSettings.freeShippingThreshold}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          freeShippingThreshold: Number(e.target.value)
                        })}
                        className="w-full p-2.5 bg-white border border-[#DDD3BF] rounded-xl text-xs font-bold text-[#1F2D24]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Banner text */}
              <div>
                <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                  نص الشريط الإعلاني العلوي في الموقع:
                </label>
                <input
                  type="text"
                  value={localSettings.shippingPromotionBannerText}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    shippingPromotionBannerText: e.target.value
                  })}
                  className="w-full p-2.5 bg-white border border-[#DDD3BF] rounded-xl text-xs text-[#1F2D24]"
                />
              </div>

              {/* Dedicated Province Rates Table Editor */}
              <div className="space-y-4 pt-4 border-t border-[#EAE3D5]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-[#18231C] flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#997A2E]" />
                      <span>قائمة أسعار الشحن والعربون ومواعيد التسليم حسب المحافظات</span>
                    </h4>
                    <p className="text-xs text-[#716B5E] mt-0.5">
                      يمكنكِ تعديل سعر الشحن (العربون) ومدة التوصيل لكل منطقة مباشرة، وستنعكس فوراً على صفحة تأكيد الطلب
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {(localSettings.provinceRates || DEFAULT_PROVINCE_RATES).map((rate) => (
                    <div key={rate.id} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D3] space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-5">
                          <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">اسم المنطقة / المحافظات:</label>
                          <input
                            type="text"
                            value={rate.regionName}
                            onChange={(e) => handleUpdateProvinceRate(rate.id, { regionName: e.target.value })}
                            className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-bold text-[#18231C]"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">سعر الشحن (العربون) ج.م:</label>
                          <input
                            type="number"
                            value={rate.price}
                            onChange={(e) => handleUpdateProvinceRate(rate.id, { price: Number(e.target.value) })}
                            className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-bold text-[#997A2E] font-mono"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">ميعاد التسليم المتوقع:</label>
                          <input
                            type="text"
                            value={rate.deliveryTime}
                            onChange={(e) => handleUpdateProvinceRate(rate.id, { deliveryTime: e.target.value })}
                            placeholder="خلال 36 ساعة"
                            className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs text-[#524E46]"
                          />
                        </div>

                        <div className="sm:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteProvinceRate(rate.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="حذف هذه المنطقة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#787267] flex items-center gap-3 pt-1 border-t border-[#F0ECE1]">
                        <span>المحافظات التابعة: {rate.governorates?.slice(0, 3).join('، ')}{rate.governorates && rate.governorates.length > 3 ? '...' : ''}</span>
                        {rate.maxWeightAllowedKg && (
                          <span className="text-[#997A2E]">الوزن المسموح: {rate.maxWeightAllowedKg} كجم (إضافي: {rate.extraKgPrice || 5} ج.م/كجم)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#121316] hover:bg-[#1A1C22] text-[#F3E5AB] border border-[#C5A059] rounded-xl text-xs font-bold flex items-center gap-2 shadow-gold"
              >
                <Save className="w-4 h-4 text-[#DFBD69]" />
                <span>حفظ كافة إعدادات الشحن والعروض وقائمة الأسعار</span>
              </button>

            </form>
          </div>
        )}

        {/* TAB 5: DEPOSIT SETTINGS */}
        {activeTab === 'deposit' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E1D3] shadow-xs max-w-2xl space-y-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#18231C]">
                إعدادات العربون وحسابات الدفع
              </h3>
              <p className="text-xs text-[#716B5E] mt-1">
                تحديد طريقة احتساب العربون من كل عميل وأرقام محافظ التحويل (إنستاباي / فودافون كاش)
              </p>
            </div>

            {settingsSavedAlert && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>تم حفظ إعدادات العربون وحسابات الدفع بنجاح!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Deposit Mode */}
              <div className="space-y-3 bg-[#FAF6ED] p-4 rounded-2xl border border-[#E9DECA]">
                <label className="text-xs font-bold text-[#1F2D24] block">طريقة حساب العربون المطلوب من العميل:</label>
                
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 text-xs text-[#1F2D24] font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="depositCalculationMode"
                      checked={localSettings.depositCalculationMode === 'shipping_fee'}
                      onChange={() => setLocalSettings({ ...localSettings, depositCalculationMode: 'shipping_fee' })}
                      className="accent-[#C5A059]"
                    />
                    <span>العربون مساوٍ لمصاريف الشحن حسب المحافظة (الخيار الموصى به والرسمي ✨)</span>
                  </label>
                  <p className="text-[11px] text-[#716B5E] mr-6">
                    يكون العربون مساوياً لسعر شحن محافظة العميل في القائمة (مثلاً 55 ج.م للإسكندرية وسط البلد، 90 ج.م للقاهرة والجيزة، 100 ج.م للدلتا، 120 ج.م للصعيد، 170 ج.م للحدود).
                  </p>

                  <label className="flex items-center gap-2.5 text-xs text-[#524E46] cursor-pointer pt-2 border-t border-[#E9DECA]/50">
                    <input
                      type="radio"
                      name="depositCalculationMode"
                      checked={localSettings.depositCalculationMode === 'fixed'}
                      onChange={() => setLocalSettings({ ...localSettings, depositCalculationMode: 'fixed' })}
                      className="accent-[#C5A059]"
                    />
                    <span>مبلغ ثابت موحد لكافة المحافظات</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-[#524E46] cursor-pointer">
                    <input
                      type="radio"
                      name="depositCalculationMode"
                      checked={localSettings.depositCalculationMode === 'percentage'}
                      onChange={() => setLocalSettings({ ...localSettings, depositCalculationMode: 'percentage' })}
                      className="accent-[#C5A059]"
                    />
                    <span>نسبة مئوية من إجمالي الطلب</span>
                  </label>
                </div>

                {localSettings.depositCalculationMode === 'fixed' && (
                  <div className="pt-2">
                    <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                      قيمة العربون الثابت (ج.م):
                    </label>
                    <input
                      type="number"
                      value={localSettings.depositFixedAmount}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        depositFixedAmount: Number(e.target.value)
                      })}
                      className="w-full p-2.5 bg-white border border-[#DDD3BF] rounded-xl text-xs font-bold text-[#1F2D24]"
                    />
                  </div>
                )}

                {localSettings.depositCalculationMode === 'percentage' && (
                  <div className="pt-2">
                    <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                      نسبة العربون المئوية (%):
                    </label>
                    <input
                      type="number"
                      value={localSettings.depositPercentage}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        depositPercentage: Number(e.target.value)
                      })}
                      className="w-full p-2.5 bg-white border border-[#DDD3BF] rounded-xl text-xs font-bold text-[#1F2D24]"
                    />
                  </div>
                )}
              </div>

              {/* Customer Service & WhatsApp Numbers */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D3] space-y-3">
                <h4 className="text-sm font-bold text-[#1F2D24] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#997A2E]" />
                  <span>رقم خدمة العملاء والواتساب الرسمي:</span>
                </h4>
                <p className="text-xs text-[#716B5E]">
                  يظهر هذا الرقم في أعلى المتجر وأسفله، وهو ذاته المخصص لخدمة العملاء واستقبال تحويلات فودافون كاش
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">رقم خدمة العملاء والمكالمات:</label>
                    <input
                      type="text"
                      value={localSettings.contactPhone}
                      onChange={(e) => setLocalSettings({ ...localSettings, contactPhone: e.target.value })}
                      className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-mono font-bold"
                      placeholder="01033277866"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">رقم الواتساب (بالكود الدولي):</label>
                    <input
                      type="text"
                      value={localSettings.whatsappNumber}
                      onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                      className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-mono font-bold"
                      placeholder="201033277866"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods Accounts */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#1F2D24]">أرقام وحسابات تحويل العربون (فودافون كاش وإنستاباي):</h4>
                
                {localSettings.paymentMethods.map((method, index) => (
                  <div key={method.id} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E1D3] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#997A2E]">{method.name}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">رقم الهاتف أو المعرف:</label>
                        <input
                          type="text"
                          value={method.number}
                          onChange={(e) => {
                            const newMethods = [...localSettings.paymentMethods];
                            newMethods[index].number = e.target.value;
                            setLocalSettings({ ...localSettings, paymentMethods: newMethods });
                          }}
                          className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#1F2D24] block mb-1">اسم صاحب الحساب:</label>
                        <input
                          type="text"
                          value={method.accountName}
                          onChange={(e) => {
                            const newMethods = [...localSettings.paymentMethods];
                            newMethods[index].accountName = e.target.value;
                            setLocalSettings({ ...localSettings, paymentMethods: newMethods });
                          }}
                          className="w-full p-2 bg-white border border-[#DDD3BF] rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin password change (Confidential, masked) */}
              <div className="pt-3 border-t border-[#EAE3D5]">
                <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                  تغيير كلمة سر لوحة الإدارة (سرية تماماً):
                </label>
                <input
                  type="password"
                  value={localSettings.adminPassword}
                  onChange={(e) => setLocalSettings({ ...localSettings, adminPassword: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#DDD3BF] rounded-xl text-xs font-mono"
                  placeholder="كلمة المرور الجديدة..."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#121316] hover:bg-[#1A1C22] text-[#F3E5AB] border border-[#C5A059] rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4 text-[#DFBD69]" />
                <span>حفظ إعدادات العربون والحسابات</span>
              </button>

            </form>
          </div>
        )}

        {/* TAB 6: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#18231C]">
                إدارة تقييمات وآراء العميلات
              </h3>
              <p className="text-xs text-[#716B5E] mt-0.5">
                استعراض آراء العميلات المنشورة في المتجر وإضافة شهادات عميلات جديدة
              </p>
            </div>

            {/* Existing Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-2xl border border-[#E8E1D3] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <strong className="text-sm font-bold text-[#1F2D24]">{rev.authorName}</strong>
                      <span className="text-xs text-[#8A7955]">{rev.date}</span>
                    </div>

                    <div className="flex text-[#DFBD69] mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>

                    <p className="text-xs text-[#524E46] leading-relaxed mb-3">
                      "{rev.comment}"
                    </p>

                    <span className="text-[11px] text-[#787267] font-medium block">
                      الموديل: {rev.productName}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#F0ECE1] flex justify-end">
                    <button
                      onClick={() => onDeleteReview(rev.id)}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      حذف التقييم
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Review Box */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E1D3] max-w-xl">
              <h4 className="font-bold text-sm text-[#18231C] mb-3">إضافة تقييم أو رأي عميلة جديد:</h4>
              <form onSubmit={handleAddReviewSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#1F2D24] block mb-1">اسم العميلة والمحافظة:</label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="مثال: أم عبد الرحمن (القاهرة)"
                    className="w-full p-2 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F2D24] block mb-1">الموديل المقيم:</label>
                  <select
                    value={newReviewProduct}
                    onChange={(e) => setNewReviewProduct(e.target.value)}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F2D24] block mb-1">رأي العميلة:</label>
                  <textarea
                    required
                    rows={2}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="ما شاء الله الخامات ممتازة..."
                    className="w-full p-2 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#121316] text-[#F3E5AB] border border-[#C5A059] text-xs font-bold rounded-xl"
                >
                  نشر التقييم في المتجر
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Screenshot Preview */}
      {previewScreenshotUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 relative text-center">
            <button
              onClick={() => setPreviewScreenshotUrl(null)}
              className="absolute top-4 left-4 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <h4 className="font-bold text-sm text-[#18231C] mb-3">معاينة إشعار تحويل العربون</h4>
            <div className="max-h-[80vh] overflow-auto rounded-xl">
              <img 
                src={previewScreenshotUrl} 
                alt="سكرين شوت العربون" 
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Product */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 my-8 text-right max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <h3 className="font-serif font-bold text-lg text-[#18231C]">
                {editingProductId ? 'تعديل بيانات الموديل' : 'إضافة موديل جديد للمتجر'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="font-bold text-[#1F2D24] block mb-1">اسم الموديل:</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="مثال: إدناء فرنسي كريب رويال قطعتين"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1F2D24] block mb-1">القسم:</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs"
                  >
                    <option value="ednaa">إدناءات شرعية</option>
                    <option value="isdal">إسدالات صلاة وخروج</option>
                    <option value="niqab">نقابات فاخرة</option>
                    <option value="khimar">خمار فرنسي وكلوش</option>
                    <option value="dress">دريسات وعبايات</option>
                    <option value="accessories">معاصم ومستلزمات</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1F2D24] block mb-1">الخامة المصنوع منها:</label>
                  <input
                    type="text"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                    placeholder="كريب رويال، سي واي، شيفون إندونيسي..."
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Pricing & Sale */}
              <div className="bg-[#FAF6ED] p-3.5 rounded-xl border border-[#E9DECA] space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#1F2D24] block mb-1">السعر الحالي (ج.م):</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-[#DDD3BF] rounded-xl text-xs font-bold text-[#997A2E]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1F2D24] block mb-1">السعر الأصلي قبل الخصم (ج.م):</label>
                    <input
                      type="number"
                      value={productForm.originalPrice || ''}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-[#DDD3BF] rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1F2D24]">
                    <input
                      type="checkbox"
                      checked={productForm.isOnSale}
                      onChange={(e) => setProductForm({ ...productForm, isOnSale: e.target.checked })}
                      className="accent-[#C5A059]"
                    />
                    <span>تفعيل شارة العرض والخصم 🔥</span>
                  </label>

                  {productForm.isOnSale && (
                    <input
                      type="text"
                      value={productForm.saleTag || ''}
                      onChange={(e) => setProductForm({ ...productForm, saleTag: e.target.value })}
                      placeholder="شارة العرض (خصم 20%)"
                      className="p-1.5 bg-white border border-[#DDD3BF] rounded-lg text-xs"
                    />
                  )}
                </div>
              </div>

              {/* Image URL + File Upload */}
              <div className="space-y-2">
                <label className="font-bold text-[#1F2D24] block mb-1">صورة الموديل:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="/banner.jpg أو رابط صورة..."
                    className="flex-1 p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs font-mono"
                  />
                  <label className="px-3 py-2 bg-[#121316] text-[#F3E5AB] border border-[#C5A059] rounded-xl font-bold cursor-pointer text-xs flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>رفع ملف</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (dataUrl) => {
                        setProductForm({ ...productForm, imageUrl: dataUrl });
                      })}
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-[#1F2D24] block mb-1">وصف الموديل والقصة:</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="إدناء قطعتين واسع وساتر..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs"
                />
              </div>

              {/* In stock toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                  className="accent-[#C5A059]"
                />
                <span className="font-bold text-[#1F2D24]">الموديل متوفر وجاهز للطلب (In Stock)</span>
              </div>

              <div className="pt-3 border-t border-[#F0ECE1] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#C5A059] to-[#DFBD69] text-[#121316] text-xs font-bold rounded-xl shadow-gold"
                >
                  حفظ الموديل
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
