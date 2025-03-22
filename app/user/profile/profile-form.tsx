'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';

import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateProfileSchema } from '@/lib/validator';
import { updateProfile } from '@/lib/actions/user.actions';
// import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

const ProfileForm = () => {
    const { data: session, update } = useSession();

    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: session?.user?.name ?? '',
            email: session?.user?.email ?? '',
            images: [],
        },
    });

    const { toast } = useToast();

    // Submit form to update profile
    async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
        const res = await updateProfile(values);

        if (!res.success) {
            return toast({
                variant: 'destructive',
                description: res.message,
            });
        } 

        const newSession = {
            ...session,
            user: {
                ...session?.user,
                name: values.name,
            },
        };

        await update(newSession);

        toast({
            description: res.message,
        });
    }

    const images = form.watch('images');



    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5">


                <div className='flex flex-col gap-5'>



                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <Input
                                        disabled
                                        placeholder='Email'
                                        {...field}
                                        className='input-field'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />





                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <Input
                                        placeholder='Name'
                                        {...field}
                                        className='input-field'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <div className='upload-field flex flex-col md:flex-row gap-5'>
                        {/* Media */}
                        <FormField
                            control={form.control}
                            name='images'
                            render={() => (
                                <FormItem className='w-full'>
                                    <FormLabel>Images</FormLabel>
                                    <Card>
                                        <CardContent className='space-y-2 mt-2 min-h-48'>
                                            <div className='flex-start space-x-2'>
                                                {images.map((image: string) => (
                                                    <Image
                                                        key={image}
                                                        src={image}
                                                        alt='user image'
                                                        className='w-20 h-20 object-cover object-center rounded-sm'
                                                        width={100}
                                                        height={100}
                                                    />
                                                ))}
                                                <FormControl>
                                                    <UploadButton
                                                        endpoint='imageUploader'
                                                        onClientUploadComplete={(res: { url: string }[]) => {
                                                            form.setValue('images', [...images, res[0].url]);
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







                </div>
                <Button
                    type='submit'
                    size='lg'
                    disabled={form.formState.isSubmitting}
                    className='button col-span-2 w-full'
                >
                    {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
                </Button>
            </form>
        </Form>
    );
};
export default ProfileForm;