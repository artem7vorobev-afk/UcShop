import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Как быстро я получу товар после оплаты?',
    answer:
      'Товары выдаются автоматически в течение 1-5 минут после успешной оплаты. В редких случаях процесс может занять до 30 минут.',
  },
  {
    question: 'Какие способы оплаты доступны?',
    answer:
      'Мы принимаем оплату через Систему быстрых платежей (СБП) с помощью QR-кода. Это безопасный и быстрый способ оплаты.',
  },
  {
    question: 'Что делать, если товар не пришёл?',
    answer:
      'Если товар не пришёл в течение 30 минут, пожалуйста, свяжитесь с нашей поддержкой через Telegram бот или форму обратной связи.',
  },
  {
    question: 'Как работает реферальная программа?',
    answer:
      'Приглашайте друзей по своей реферальной ссылке и получайте 0.5% от суммы каждого их оплаченного заказа. Минимальная сумма для вывода — 4000 ₽.',
  },
  {
    question: 'Можно ли вернуть товар?',
    answer:
      'Цифровые товары не подлежат возврату после выдачи. Если возникли проблемы с получением товара, обратитесь в поддержку.',
  },
  {
    question: 'Как использовать промокод?',
    answer:
      'Введите промокод на этапе оформления заказа. Скидка будет автоматически применена к итоговой сумме.',
  },
];

export default function FAQPage() {
  return (
    <div className="space-y-5 animate-fade-up">
      <h2 className="text-xl font-extrabold tracking-tight">Часто задаваемые вопросы</h2>

      <div className="space-y-2.5">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
          >
            <div className="flex items-start gap-3">
              <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d5e]" strokeWidth={1.8} />
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug">{faq.question}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
