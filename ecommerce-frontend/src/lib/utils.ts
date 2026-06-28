import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getEmailProviderUrl = (emailAddress: string | undefined) => {
  if (!emailAddress) return "https://mail.google.com";
  const domain = emailAddress.split('@')[1]?.toLowerCase();
  
  if (domain === 'gmail.com') return "https://mail.google.com/mail/u/0/#inbox";
  if (domain === 'yahoo.com' || domain === 'ymail.com') return "https://mail.yahoo.com";
  if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com') return "https://outlook.live.com/mail/0/inbox";
  if (domain === 'icloud.com' || domain === 'me.com' || domain === 'mac.com') return "https://www.icloud.com/mail";
  
  return "https://mail.google.com";
};
