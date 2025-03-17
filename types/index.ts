import { cartItemSchema, insertCartSchema, insertOrderItemSchema, insertOrderSchema, insertProductSchema, shippingAddressSchema } from '@/lib/validator';
import { z } from 'zod';

export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    createdAt: Date;
    rating: string;
    numReviews: number;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;



export type ShippingAddress = z.infer<typeof shippingAddressSchema>;


export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
    id: string;
    createdAt: Date;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    orderitems: OrderItem[];
    user: { name: string; email: string };
};