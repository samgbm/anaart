'use client';

import { useToast } from '@/hooks/use-toast';
import { PRODUCT_CATEGORIES, PRODUCT_COLORS, PRODUCT_MATERIALS, PRODUCT_MEDIUMS, PRODUCT_ORIENTATIONS, PRODUCT_SIZES, PRODUCT_STYLES, PRODUCT_SUBJECTS, productDefaultValues } from '@/lib/constants';
import { insertProductSchema, updateProductSchema } from '@/lib/validator';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import slugify from 'slugify';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Checkbox } from '../ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
const ProductForm = ({
    type,
    product,
    productId,
}: {
    type: 'Create' | 'Update';
    product?: Product;
    productId?: string;
}) => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof insertProductSchema>>({
        // resolver:
        //     type === 'Update'
        //         ? zodResolver(updateProductSchema)
        //         : zodResolver(insertProductSchema),
        resolver: zodResolver(insertProductSchema),
        defaultValues:
            product && type === 'Update' ? product : productDefaultValues,
    });

    const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
        values
    ) => {
        // On Create
        if (type === 'Create') {
            const res = await createProduct(values);

            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                });
            } else {
                toast({
                    description: res.message,
                });
                router.push('/admin/products');
            }
        }

        // On Update
        if (type === 'Update') {
            if (!productId) {
                router.push('/admin/products');
                return;
            }

            const res = await updateProduct({ ...values, id: productId });

            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                });
            } else {
                toast({
                    description: res.message,
                });
                router.push('/admin/products');
            }
        }
    };

    const media = form.watch('media');
    const isFeatured = form.watch('isFeatured');
    const banner = form.watch('banner');

    return (
        <Form {...form}>
            <form
                method='POST'
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
            >
                <div className='flex flex-col md:flex-row gap-5'>


                    {/* Name */}
                    <FormField
                        control={form.control}
                        name='name'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'name'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter artwork name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/* Slug */}
                    <FormField
                        control={form.control}
                        name='slug'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'slug'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <div className='relative'>
                                        <Input placeholder='Enter slug' {...field} />
                                        <Button
                                            type='button'
                                            className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2'
                                            onClick={() => {
                                                form.setValue(
                                                    'slug',
                                                    slugify(form.getValues('name'), { lower: true })
                                                );
                                            }}
                                        >
                                            Generate
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col md:flex-row gap-5'>

                    {/* Category */}
                    <FormField
                        control={form.control}
                        name='category'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'category'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Category</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a style' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PRODUCT_CATEGORIES.map((style) => (
                                            <SelectItem key={style} value={style}>
                                                {style.charAt(0).toUpperCase() + style.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/* Style */}
                    <FormField
                        control={form.control}
                        name='style'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'style'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Style</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a style' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PRODUCT_STYLES.map((style) => (
                                            <SelectItem key={style} value={style}>
                                                {style.charAt(0).toUpperCase() + style.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex flex-col md:flex-row gap-5'>


                    {/* Subject */}
                    <FormField
                        control={form.control}
                        name='subject'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'subject'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Subject</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a Subject' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PRODUCT_SUBJECTS.map((style) => (
                                            <SelectItem key={style} value={style}>
                                                {style.charAt(0).toUpperCase() + style.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Medium */}
                    <FormField
                        control={form.control}
                        name='medium'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'medium'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Medium</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a Medium' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PRODUCT_MEDIUMS.map((style) => (
                                            <SelectItem key={style} value={style}>
                                                {style.charAt(0).toUpperCase() + style.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>



                <div className='flex flex-col md:flex-row gap-5'>


                    {/* Material */}
                    <FormField
                        control={form.control}
                        name='material'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'material'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Material</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a Material' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PRODUCT_MATERIALS.map((style) => (
                                            <SelectItem key={style} value={style}>
                                                {style.charAt(0).toUpperCase() + style.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Size     */}
                    <FormField
                        control={form.control}
                        name='size'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'size'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Size</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a Size' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PRODUCT_SIZES.map((style) => (
                                            <SelectItem key={style} value={style}>
                                                {style.charAt(0).toUpperCase() + style.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex flex-col md:flex-row gap-5'>


                    {/* Orientation */}
                    <FormField
                        control={form.control}
                        name='orientation'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'orientation'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Orientation</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a Orientation' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PRODUCT_ORIENTATIONS.map((style) => (
                                            <SelectItem key={style} value={style}>
                                                {style.charAt(0).toUpperCase() + style.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Color */}
                    <FormField
                        control={form.control}
                        name='color'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'color'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Color</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a Color' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PRODUCT_COLORS.map((style) => (
                                            <SelectItem key={style} value={style}>
                                                {style.charAt(0).toUpperCase() + style.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>



                <div className='flex flex-col md:flex-row gap-5'>


                    {/* Author */}
                    <FormField
                        control={form.control}
                        name='author'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'author'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Author</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter author name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Authorcountry */}
                    <FormField
                        control={form.control}
                        name='authorcountry'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'authorcountry'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Author&apos;s Country</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter country' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>




                <div className='upload-field flex flex-col md:flex-row gap-5'>
                    {/* Media */}
                    <FormField
                        control={form.control}
                        name='media'
                        render={() => (
                            <FormItem className='w-full'>
                                <FormLabel>Media</FormLabel>
                                <Card>
                                    <CardContent className='space-y-2 mt-2 min-h-48'>
                                        <div className='flex-start space-x-2'>
                                            {media.map((image: string) => (
                                                <Image
                                                    key={image}
                                                    src={image}
                                                    alt='product image'
                                                    className='w-20 h-20 object-cover object-center rounded-sm'
                                                    width={100}
                                                    height={100}
                                                />
                                            ))}
                                            <FormControl>
                                                <UploadButton
                                                    endpoint='imageUploader'
                                                    onClientUploadComplete={(res: { url: string }[]) => {
                                                        form.setValue('media', [...media, res[0].url]);
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast({
                                                            variant: 'destructive',
                                                            description: `ERROR! ${error.message}`,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </div>
                                    </CardContent>
                                </Card>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex flex-col md:flex-row gap-5'>





                    {/* Price */}
                    <FormField
                        control={form.control}
                        name='price'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'price'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter product price' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Stock */}
                    <FormField
                        control={form.control}
                        name='stock'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'stock'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter stock' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    {/* Description */}
                    <FormField
                        control={form.control}
                        name='description'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                                z.infer<typeof insertProductSchema>,
                                'description'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Enter product description'
                                        className='resize-none'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='upload-field'>
                    {/* isFeatured */}
                    Featured Product
                    <Card>
                        <CardContent className='space-y-2 mt-2'>
                            <FormField
                                control={form.control}
                                name='isFeatured'
                                render={({ field }) => (
                                    <FormItem className='space-x-2 items-center'>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Is Featured?</FormLabel>
                                    </FormItem>
                                )}
                            />
                            {isFeatured && banner && (
                                <Image
                                    src={banner}
                                    alt='banner image'
                                    className='w-full object-cover object-center rounded-sm'
                                    width={1920}
                                    height={680}
                                />
                            )}

                            {isFeatured && !banner && (
                                <UploadButton
                                    endpoint='imageUploader'
                                    onClientUploadComplete={(res: { url: string }[]) => {
                                        form.setValue('banner', res[0].url);
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast({
                                            variant: 'destructive',
                                            description: `ERROR! ${error.message}`,
                                        });
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>


                <div>
                    <Button
                        type='submit'
                        size='lg'
                        disabled={form.formState.isSubmitting}
                        className='button col-span-2 w-full'
                    >
                        {form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProductForm;
