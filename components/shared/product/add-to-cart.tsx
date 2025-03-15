'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { CartItem } from '@/types';
import { toast } from 'sonner';


const AddToCart = ({ item }: { item: CartItem; }) => {
    const router = useRouter();

    const handleAddToCart = async () => {
        // Execute the addItemToCart action
        const res = await addItemToCart(item);

        // Display appropriate toast message based on the result
        if (!res.success) {
            toast(res.message);

            return;
        }

        toast(`${item.name} added to the cart`, {
            description: (
                <button
                    className='bg-primary text-white hover:bg-gray-800 px-3 py-2 rounded-md'
                    onClick={() => router.push('/cart')}
                >
                    Go to cart
                </button>
            ),
        });

    };

    return <Button className='w-full' type='button' onClick={handleAddToCart}> <Plus />Add To Cart</Button>;
};

export default AddToCart;