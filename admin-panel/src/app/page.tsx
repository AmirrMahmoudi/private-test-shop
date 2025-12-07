// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

// import { fetchProducts, fetchOrders } from "@/lib/api";

// export default async function HomePage() {
//   // Fetch data
//   const [products, orders] = await Promise.all([
//     fetchProducts(),
//     fetchOrders()
//   ]);

//   // Calculate statistics
//   const totalProducts = products.length;

//   // Calculate today's orders
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const todayOrders = orders.filter(order => {
//     const orderDate = new Date(order.createdAt);
//     orderDate.setHours(0, 0, 0, 0);
//     return orderDate.getTime() === today.getTime();
//   });

//   // Calculate today's revenue
//   const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

//   // Calculate total customers (unique users from orders as a proxy, or just placeholder if no user API)
//   // Since we don't have a users API yet, we'll keep it as placeholder or remove.
//   // Let's use a simple proxy: count of unique orders for now or just "--" with a note.
//   // Better to show total orders instead of customers if we don't have customer data.
//   const totalOrders = orders.length;

//   return (
//     <div className="p-6 md:p-8">
//       <h1 className="text-3xl font-bold mb-8">داشبورد مدیریت</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-card p-6 rounded-lg border">
//           <p className="text-muted-foreground text-sm">کل محصولات</p>
//           <p className="text-3xl font-bold mt-2">{totalProducts}</p>
//         </div>
//         <div className="bg-card p-6 rounded-lg border">
//           <p className="text-muted-foreground text-sm">سفارشات امروز</p>
//           <p className="text-3xl font-bold mt-2">{todayOrders.length}</p>
//         </div>
//         <div className="bg-card p-6 rounded-lg border">
//           <p className="text-muted-foreground text-sm">درآمد امروز</p>
//           <p className="text-3xl font-bold mt-2">{todayRevenue.toLocaleString('fa-IR')} تومان</p>
//         </div>
//         <div className="bg-card p-6 rounded-lg border">
//           <p className="text-muted-foreground text-sm">کل سفارشات</p>
//           <p className="text-3xl font-bold mt-2">{totalOrders}</p>
//         </div>
//       </div>

//       <div className="mt-8 bg-card p-6 rounded-lg border">
//         <h2 className="text-xl font-semibold mb-4">خوش آمدید!</h2>
//         <p className="text-muted-foreground">
//           از منوی کناری می‌توانید به بخش‌های مختلف پنل مدیریت دسترسی داشته باشید.
//         </p>
//       </div>
//     </div>
//   );
// }

// این سه خط رو کامل حذف کن:
// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

// به جاش فقط این یه خط رو بذار:

export const dynamic = "force-dynamic";

import { fetchProducts, fetchOrders } from "@/lib/api";

export default async function HomePage() {
  const [products, orders] = await Promise.all([
    fetchProducts(),
    fetchOrders(),
  ]).catch(() => [[], []]); // اگر در build time خطا داد، داده خالی برگردون

  const totalProducts = products.length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter((order: any) => {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });

  const todayRevenue = todayOrders.reduce(
    (sum: number, order: any) => sum + order.total,
    0
  );
  const totalOrders = orders.length;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-8">داشبورد مدیریت</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-muted-foreground text-sm">کل محصولات</p>
          <p className="text-3xl font-bold mt-2">{totalProducts}</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-muted-foreground text-sm">سفارشات امروز</p>
          <p className="text-3xl font-bold mt-2">{todayOrders.length}</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-muted-foreground text-sm">درآمد امروز</p>
          <p className="text-3xl font-bold mt-2">
            {todayRevenue.toLocaleString("fa-IR")} تومان
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-muted-foreground text-sm">کل سفارشات</p>
          <p className="text-3xl font-bold mt-2">{totalOrders}</p>
        </div>
      </div>

      <div className="mt-8 bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">خوش آمدید!</h2>
        <p className="text-muted-foreground">
          از منوی کناری می‌توانید به بخش‌های مختلف پنل مدیریت دسترسی داشته
          باشید.
        </p>
      </div>
    </div>
  );
}
