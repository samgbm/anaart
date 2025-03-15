'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { CartItem } from '@/types';
import { toast } from "sonner"
import { Plus } from 'lucide-react';


const AddToCart = ({ item }: { item: CartItem; }) => {
    const router = useRouter();

    const handleAddToCart = async () => {
        // Execute the addItemToCart action
        const res = await addItemToCart(item);

        // Display appropriate toast message based on the result
        if (!res.success) {
            toast.error(res.message)
            // toast({
            //     variant: 'destructive',
            //     description: res.message,
            // });
            return;
        }


        toast(`${item.name} added to the cart`, {
            action: {
                label: 'Go to cart',
                onClick: () => router.push('/cart')
            },
        })

        // toast({
        //     description: `${item.name} added to the cart`,
        //     action: (
        //         <ToastAction
        //             className='bg-primary text-white hover:bg-gray-800'
        //             onClick={() => router.push('/cart')}
        //             altText='Go to cart'
        //         >
        //             Go to cart
        //         </ToastAction>
        //     ),
        // });
    };

    return <Button className='w-full' type='button' onClick={handleAddToCart}> <Plus />Add To Cart</Button>;
};

export default AddToCart;