import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - UcShop1',
  description: 'Панель администратора UcShop1',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      {/* Admin Header */}
      <header className="glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gradient">UcShop1 Admin</h1>
            <nav className="flex gap-4">
              <a href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
                Dashboard
              </a>
              <a href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
                Заказы
              </a>
              <a href="/admin/products" className="text-sm text-muted-foreground hover:text-foreground">
                Товары
              </a>
              <a href="/admin/logout" className="text-sm text-muted-foreground hover:text-foreground">
                Выйти
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
