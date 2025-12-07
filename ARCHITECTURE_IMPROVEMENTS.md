# بهبودهای معماری محصولات

این سند تغییرات اعمال شده برای بهبود معماری سیستم محصولات را شرح می‌دهد.

## تغییرات اعمال شده

### 1. Backend Routes

#### ✅ Brands Route (`backend/src/routes/brands.ts`)
- ایجاد route کامل برای مدیریت برندها
- GET `/api/brands` - لیست همه برندها
- GET `/api/brands/:id` - دریافت یک برند
- POST `/api/brands` - ایجاد برند جدید
- PUT `/api/brands/:id` - به‌روزرسانی برند
- DELETE `/api/brands/:id` - حذف نرم برند

#### ✅ Variants Route (`backend/src/routes/variants.ts`)
- ایجاد route کامل برای مدیریت واریانت‌های محصول
- GET `/api/variants/product/:productId` - لیست واریانت‌های یک محصول
- GET `/api/variants/:id` - دریافت یک واریانت
- POST `/api/variants` - ایجاد واریانت جدید
- PUT `/api/variants/:id` - به‌روزرسانی واریانت
- DELETE `/api/variants/:id` - حذف نرم واریانت

#### ✅ Products Route (به‌روزرسانی شده)
- استفاده از `brandId` به جای `brand` (string)
- استفاده از `categoryId` و `subcategoryId` به جای string
- استفاده از `basePrice` به جای `price`
- استفاده از `images` (JSON array) به جای `image` (string)
- اضافه شدن فیلتر بر اساس `brandId`
- اضافه شدن فیلتر بر اساس `tag`
- محاسبه قیمت و موجودی از واریانت‌ها
- شامل کردن relations (category, subcategory, brand, variants) در response

#### ✅ Categories Route (به‌روزرسانی شده)
- استفاده از مدل `Subcategory` به جای JSON string
- GET `/api/categories/:categoryId/subcategories` - لیست زیردسته‌های یک دسته
- POST `/api/categories/:categoryId/subcategories` - ایجاد زیردسته جدید
- PUT `/api/categories/subcategories/:id` - به‌روزرسانی زیردسته
- DELETE `/api/categories/subcategories/:id` - حذف زیردسته

### 2. Admin Panel

#### ✅ API Client (`admin-panel/src/lib/api.ts`)
- اضافه شدن types برای `Brand`, `Subcategory`, `ProductVariant`
- به‌روزرسانی `Product` type برای ساختار جدید
- اضافه شدن functions برای brands و variants
- اضافه شدن functions برای subcategories

#### ✅ Product Creation Form (`admin-panel/src/app/products/new/page.tsx`)
- استفاده از dropdown برای انتخاب برند (brandId)
- استفاده از dropdown برای انتخاب زیردسته (subcategoryId)
- پشتیبانی از چند تصویر (images array)
- مدیریت تگ‌ها به صورت array
- استفاده از `basePrice` به جای `price`

#### ✅ Products List Page (`admin-panel/src/app/products/page.tsx`)
- به‌روزرسانی برای نمایش ساختار جدید
- نمایش برند از relation
- نمایش دسته‌بندی از relation
- پشتیبانی از backward compatibility

### 3. Frontend (Next App)

#### ✅ API Client (`next-app/src/lib/api.ts`)
- به‌روزرسانی types برای ساختار جدید
- اضافه شدن functions برای brands و variants
- به‌روزرسانی `fetchProducts` برای پشتیبانی از فیلترهای جدید
- پشتیبانی از backward compatibility

## ساختار جدید داده‌ها

### Product
```typescript
{
  id: string;
  name: string;
  slug: string;
  basePrice: number;        // قیمت پایه
  price: number;            // قیمت محاسبه شده (از واریانت یا basePrice)
  images: string[];         // آرایه تصاویر
  categoryId: string;
  category: { id, name, slug };
  subcategoryId?: string;
  subcategory?: { id, name, slug };
  brandId?: string;
  brand?: { id, name, nameEn, logo };
  tags: string[];           // آرایه تگ‌ها
  variants?: ProductVariant[];
  // ...
}
```

### Brand
```typescript
{
  id: string;
  name: string;
  nameEn?: string;
  logo?: string;
  description?: string;
  isActive: boolean;
}
```

### Subcategory
```typescript
{
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  isActive: boolean;
  sortOrder: number;
}
```

### ProductVariant
```typescript
{
  id: string;
  productId: string;
  name: string;
  sku: string;
  color?: string;
  colorCode?: string;
  size?: string;
  price: number;
  stock: number;
  image?: string;
  isDefault: boolean;
  isActive: boolean;
}
```

## فیلترهای جدید

### Products API
- `?category=categoryId` - فیلتر بر اساس دسته
- `?subcategory=subcategoryId` - فیلتر بر اساس زیردسته
- `?brand=brandId` - فیلتر بر اساس برند
- `?tag=tagName` - فیلتر بر اساس تگ
- `?featured=true` - فقط محصولات ویژه
- `?minPrice=1000&maxPrice=5000` - فیلتر قیمت
- `?inStock=true` - فقط محصولات موجود

## کارهای باقی‌مانده

### 1. Migration داده‌های موجود
- اجرای migration script برای تبدیل داده‌های قدیمی
- تبدیل برندهای string به Brand entries
- تبدیل subcategories JSON به Subcategory entries
- به‌روزرسانی products برای استفاده از relations

### 2. Frontend Components
- به‌روزرسانی `products-filters.tsx` برای فیلتر برند و تگ
- به‌روزرسانی `products-client.tsx` برای ساختار جدید
- به‌روزرسانی `products-grid.tsx` برای نمایش variants
- به‌روزرسانی صفحه محصول برای انتخاب variant

### 3. Admin Panel
- ایجاد صفحه مدیریت برندها
- ایجاد صفحه مدیریت زیردسته‌ها
- اضافه کردن UI برای مدیریت variants در فرم محصول

### 4. Testing
- تست API endpoints
- تست migration script
- تست backward compatibility
- تست فیلترها

## نحوه استفاده

### ایجاد برند جدید
```typescript
await createBrand({
  name: "لورآل",
  nameEn: "L'Oreal",
  logo: "https://...",
  description: "..."
});
```

### ایجاد محصول با برند
```typescript
await createProduct({
  name: "ماسک مو کراتینه",
  basePrice: 320000,
  categoryId: "hairmask",
  subcategoryId: "shower",
  brandId: "brand-id-here",
  images: ["url1", "url2"],
  tags: ["کراتینه", "داخل حمام"]
});
```

### ایجاد واریانت برای محصول
```typescript
await createVariant({
  productId: "product-id",
  name: "500ml",
  sku: "HAIR-MASK-500ML",
  size: "500ml",
  price: 320000,
  stock: 50,
  isDefault: true
});
```

## نکات مهم

1. **Backward Compatibility**: کدهای فعلی سعی کرده‌اند backward compatibility را حفظ کنند، اما برای استفاده کامل از قابلیت‌های جدید باید frontend components به‌روزرسانی شوند.

2. **Migration**: قبل از استفاده در production، حتماً migration script را اجرا کنید و داده‌های موجود را تبدیل کنید.

3. **Variants**: محصولاتی که واریانت ندارند، باید یک واریانت پیش‌فرض داشته باشند. این در migration script انجام می‌شود.

4. **Images**: تصاویر به صورت JSON array ذخیره می‌شوند. اولین تصویر به عنوان `image` اصلی استفاده می‌شود.

5. **Price**: `basePrice` قیمت پایه محصول است. قیمت واقعی از واریانت‌ها محاسبه می‌شود. اگر واریانتی وجود نداشته باشد، از `basePrice` استفاده می‌شود.






