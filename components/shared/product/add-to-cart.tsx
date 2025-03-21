'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader } from 'lucide-react';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { Cart, CartItem } from '@/types';
import { toast } from 'sonner';
import { useTransition } from 'react';


const AddToCart = ({ cart, item }: { cart?: Cart, item: CartItem; }) => {


    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAddToCart = async () => {
        startTransition(async () => {
            // Execute the addItemToCart action
            const res = await addItemToCart(item);

            // Display appropriate toast message based on the result
            if (!res?.success) {
                toast(res?.message);

                return;
            }

            toast(res.message, {
                description: (
                    <button
                        className='bg-primary text-white hover:bg-gray-800 px-3 py-2 rounded-md'
                        onClick={() => router.push('/cart')}
                    >
                        Go to cart
                    </button>
                ),
            });

        });
    };

    // Remove item from cart
    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeItemFromCart(item.productId);

            toast(
                res.message
            );

            return;
        });

    };

    const existItem =
        cart && cart.items.find((x) => x.productId === item.productId);

    return existItem ? (
        <div>
            <Button disabled={isPending} type='button' variant='outline' onClick={handleRemoveFromCart}>
                {isPending ? (
                    <Loader className='w-4 h-4  animate-spin' />
                ) : (
                    <Minus className='w-4 h-4' />
                )}
            </Button>
            <span className='px-2'>{existItem.qty}</span>
            <Button disabled={isPending} type='button' variant='outline' onClick={handleAddToCart}>
                {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Plus className='w-4 h-4' />
                )}
            </Button>
        </div>
    ) : (
        <Button disabled={isPending} className='w-full' type='button' onClick={handleAddToCart}>
            {isPending ? (
                <Loader className='w-4 h-4 animate-spin' />
            ) : (
                <Plus className='w-4 h-4' />
            )}
            Add to cart
        </Button>
    );
};

export default AddToCart;