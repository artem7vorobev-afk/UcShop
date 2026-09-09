import * as bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password);
  return prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
}

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin || !admin.isActive) {
    return null;
  }

  const isValid = await verifyPassword(password, admin.password);
  if (!isValid) {
    return null;
  }

  return admin;
}

export async function createOrUpdateTelegramUser(telegramData: {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}) {
  return prisma.user.upsert({
    where: { telegramId: telegramData.id },
    update: {
      telegramUsername: telegramData.username,
      firstName: telegramData.first_name,
      lastName: telegramData.last_name,
    },
    create: {
      telegramId: telegramData.id,
      telegramUsername: telegramData.username,
      firstName: telegramData.first_name,
      lastName: telegramData.last_name,
      referralCode: generateReferralCode(),
    },
  });
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
