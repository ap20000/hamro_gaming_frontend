import { Account } from "@/components/ui/admin/game_form";

export interface Game {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  deliveryTime: string;
  platform: string;
  region: string;
  gameType: string;
  status: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  productType?: 'topup' | 'giftcard' | 'cdkey' | 'account';
  itemType?: string;
  topupOptions?: Array<{
    label: string;
    amount: string;
    price: string;
  }>;
  giftcardAmountOptions?: Array<{
    label: string;
    amount: string;
    price: string;
  }>;
    accounts?: Account[];
  accountType?: "private" | "shared";
  sharedAccount?: {
    email: string;
    password: string;
    code?: string;
    quantity: number;
    soldCount?: number;
    price: string;
    label: string;
  };
  quantity?: number;
  keys?: string[];
  expirationDate?: string;
}