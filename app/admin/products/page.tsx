import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminProductsPage() {
  // Mock data - will be replaced with API call
  const products = [
    { id: '1', name: 'Telegram Stars', category: 'Telegram Stars', variants: 5, isActive: true },
    { id: '2', name: 'PUBG Mobile UC', category: 'PUBG Mobile', variants: 5, isActive: true },
    { id: '3', name: 'Steam Wallet', category: 'Steam', variants: 5, isActive: true },
    { id: '4', name: 'Genshin Impact', category: 'PC игры', variants: 5, isActive: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Товары</h2>
        <Button variant="neon">Добавить товар</Button>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Все товары</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category} • {product.variants} вариантов
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Редактировать
                  </Button>
                  <Button variant="outline" size="sm">
                    {product.isActive ? 'Отключить' : 'Включить'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
