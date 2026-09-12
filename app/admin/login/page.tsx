import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glass w-full max-w-md neon-glow">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Вход в админку</CardTitle>
          <CardDescription className="text-center">
            Введите email и пароль для доступа к панели управления
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input type="email" placeholder="admin@ucshop1.ru" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Пароль</label>
              <Input type="password" placeholder="••••••••" required />
            </div>
            <Button variant="neon" className="w-full">
              Войти
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            <p>Тестовые данные:</p>
            <p>Email: admin@ucshop1.ru</p>
            <p>Пароль: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
