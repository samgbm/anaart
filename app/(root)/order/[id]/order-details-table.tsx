'use client';

import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import {
    PayPalButtons,
    PayPalScriptProvider,
    usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { approvePayPalOrder, createPayPalOrder, deliverOrder, updateOrderToPaidByCOD } from '@/lib/actions/order.actions';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import StripePayment from './stripe-payment';

const OrderDetailsTable = ({
    order,
    paypalClientId,
    isAdmin,
    stripeClientSecret,
}: {
    order: Omit<Order, 'paymentResult'>;
    paypalClientId: string;
    isAdmin: boolean;
    stripeClientSecret: string | null;
}) => {

    const {
        shippingAddress,
        orderitems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentMethod,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
    } = order;

    // Checks the loading status of the PayPal script
    function PrintLoadingState() {
        const [{ isPending, isRejected }] = usePayPalScriptReducer();
        let status = '';
        if (isPending) {
            status = 'Loading PayPal...';
        } else if (isRejected) {
            status = 'Error in loading PayPal.';
        }
        return status;
    }

    // Creates a PayPal order
    const handleCreatePayPalOrder = async () => {
        const res = await createPayPalOrder(order.id);
        if (!res.success)
            return toast.error(res.message);
        return res.data;
    };

    // Approves a PayPal order
    const handleApprovePayPalOrder = async (data: { orderID: string }) => {
        const res = await approvePayPalOrder(order.id, data);
        if (!res.success)
            toast.error(res.message);
        else
            toast.success(res.message);
    };

    // Button To mark the order as paid
    const MarkAsPaidButton = () => {
        const [isPending, startTransition] = useTransition();
        const { toast } = useToast();
        return (
            <Button
                type='button'
                disabled={isPending}
                onClick={() =>
                    startTransition(async () => {
                        const res = await updateOrderToPaidByCOD(order.id);
                        toast({
                            variant: res.success ? 'default' : 'destructive',
                            description: res.message,
                        });
                    })
                }
            >
                {isPending ? 'processing...' : 'Mark As Paid'}
            </Button>
        );
    };

    // Button To mark the order as delivered
    const MarkAsDeliveredButton = () => {
        const [isPending, startTransition] = useTransition();
        const { toast } = useToast();
        return (
            <Button
                type='button'
                disabled={isPending}
                onClick={() =>
                    startTransition(async () => {
                        const res = await deliverOrder(order.id);
                        toast({
                            variant: res.success ? 'default' : 'destructive',
                            description: res.message,
                        });
                    })
                }
            >
                {isPending ? 'processing...' : 'Mark As Delivered'}
            </Button>
        );
    };

    return (
        <>
            <h1 className='py-4 text-2xl'> Order {formatId(order.id)}</h1>
            <div className='grid md:grid-cols-3 md:gap-5'>
                <div className='overflow-x-auto md:col-span-2 space-y-4'>
                    <Card>
                        <CardContent className='p-4 gap-4'>
                            <h2 className='text-xl pb-4'>Payment Method</h2>
                            <p>{paymentMethod}</p>
                            {isPaid ? (
                                <Badge variant='secondary'>
                                    Paid at {formatDateTime(paidAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant='destructive'>Not paid</Badge>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className='p-4 gap-4'>
                            <h2 className='text-xl pb-4'>Shipping Address</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p>
                                {shippingAddress.streetAddress}, {shippingAddress.city},{' '}
                                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
                            </p>
                            {isDelivered ? (
                                <Badge variant='secondary'>
                                    Delivered at {formatDateTime(deliveredAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant='destructive'>Not delivered</Badge>
                            )}
                        </CardContent>
                    </Card>


                    <Card>
                        <CardContent className='p-4 gap-4'>
                            <h2 className='text-xl pb-4'>Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderitems.map((item) => (
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    className='flex items-center'
                                                >
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                    ></Image>
                                                    <span className='px-2'>{item.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <span className='px-2'>{item.qty}</span>
                                            </TableCell>
                                            <TableCell className='text-right'>${item.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className='p-4 space-y-4 gap-4'>
                            <h2 className='text-xl pb-4'>Order Summary</h2>
                            <div className='flex justify-between'>
                                <div>Items</div>
                                <div>{formatCurrency(itemsPrice)}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div>Tax</div>
                                <div>{formatCurrency(taxPrice)}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div>Shipping</div>
                                <div>{formatCurrency(shippingPrice)}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div>Total</div>
                                <div>{formatCurrency(totalPrice)}</div>
                            </div>

                            {
                                !isPaid && paymentMethod === 'PayPal' && (
                                    <div>
                                        <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                                            <PrintLoadingState />
                                            <PayPalButtons
                                                createOrder={handleCreatePayPalOrder}
                                                onApprove={handleApprovePayPalOrder}
                                            />
                                        </PayPalScriptProvider>
                                    </div>
                                )
                            }


                            {
                                /* Stripe Payment */
                            }
                            {
                                !isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
                                    <StripePayment
                                        priceInCents={Number(order.totalPrice) * 100}
                                        orderId={order.id}
                                        clientSecret={stripeClientSecret}

                                    />
                                )
                            }

                            {
                                /* Cash On Delivery */
                            }
                            {
                                isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                                    <MarkAsPaidButton />
                                )
                            }
                            {
                                isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />
                            }

                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default OrderDetailsTable;