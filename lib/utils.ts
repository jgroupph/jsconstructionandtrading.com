import bcrypt from "bcryptjs";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10; // good balance of security and performance
  const hashed = await bcrypt.hash(plainPassword, saltRounds);
  return hashed;
}