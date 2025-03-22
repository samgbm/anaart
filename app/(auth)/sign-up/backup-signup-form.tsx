'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';

import { useSearchParams } from 'next/navigation';
// import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUp } from '@/lib/actions/user.actions';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { prisma } from '@/db/prisma';
import { Prisma } from '@prisma/client';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { signUpFormSchema } from '@/lib/validator';
import { UploadButton } from '@/lib/uploadthing';

import { signIn } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const SignUpForm = () => {



    const form = useForm<z.infer<typeof signUpFormSchema>>({

        resolver: zodResolver(signUpFormSchema),
        defaultValues: signUpDefaultValues,
    });


    const onSubmit: SubmitHandler<z.infer<typeof signUpFormSchema>> = async (
        user
    ) => {



        try {


            // const user = signUpFormSchema.parse({
            //     name: formData.get('name'),
            //     email: formData.get('email'),
            //     confirmPassword: formData.get('confirmPassword'),
            //     password: formData.get('password'),
            // });

            const plainPassword = user.password;

            user.password = hashSync(user.password, 10);

            await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                },
            });

            await signIn('credentials', {
                email: user.email,
                password: plainPassword,
            });

            return { success: true, message: 'User created successfully' };
        } catch (error) {
            if (isRedirectError(error)) {
                throw error;
            }

            return {
                success: false,
                message: formatError(error), // Change this line
            };
        }


    };

    // const [data, action] = useActionState(signUp, {
    //     message: '',
    //     success: false,
    // });

    const images = form.watch('images');

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    // const SignUpButton = () => {
    //     const { pending } = useFormStatus();
    //     return (
    //         <Button disabled={pending} className='w-full' variant='default'>
    //             {pending ? 'Submitting...' : 'Sign Up'}
    //         </Button>
    //     );
    // };

    return (

        <Form {...form}>
            <form
                method='POST'
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
            >
                <div className='flex flex-col md:flex-row gap-5'>

                    {/* <input type='hidden' name='callbackUrl' value={callbackUrl} /> */}





                    <div>
                        {/* <Label htmlFor='name'>Name</Label>
                        <Input
                            id='name'
                            name='name'
                            required
                            type='text'
                            defaultValue={signUpDefaultValues.name}
                            autoComplete='name'
                        /> */}




                        {/* Name */}
                        <FormField
                            control={form.control}
                            name='name'
                            render={({
                                field,
                            }: {
                                field: ControllerRenderProps<
                                    z.infer<typeof signUpFormSchema>,
                                    'name'
                                >;
                            }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter your name' {...field} />
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



                    <div>
                        {/* <Label htmlFor='email'>Email</Label>
                        <Input
                            id='email'
                            name='email'
                            required
                            type='email'
                            defaultValue={signUpDefaultValues.email}
                            autoComplete='email'
                        /> */}


                        {/* Email */}
                        <FormField
                            control={form.control}
                            name='email'
                            render={({
                                field,
                            }: {
                                field: ControllerRenderProps<
                                    z.infer<typeof signUpFormSchema>,
                                    'email'
                                >;
                            }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter your email' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>



                    <div>
                        // <Label htmlFor='password'>Password</Label>
                        // <Input
                            //     id='password'
                            //     name='password'
                            //     required
                            //     type='password'
                            //     defaultValue={signUpDefaultValues.password}
                            //     autoComplete='current-password'
                            // />



                            {/* Password */}
                        <FormField
                            control={form.control}
                            name='password'
                            render={({
                                field,
                            }: {
                                field: ControllerRenderProps<
                                    z.infer<typeof signUpFormSchema>,
                                    'password'
                                >;
                            }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter your password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>




                    <div>
                        // <Label htmlFor='confirmPassword'>Confirm Password</Label>
                        // <Input
                            //     id='confirmPassword'
                            //     name='confirmPassword'
                            //     required
                            //     type='password'
                            //     defaultValue={signUpDefaultValues.confirmPassword}
                            //     autoComplete='current-password'
                            // />




                            {/* Confirm password */}
                        <FormField
                            control={form.control}
                            name='confirmPassword'
                            render={({
                                field,
                            }: {
                                field: ControllerRenderProps<
                                    z.infer<typeof signUpFormSchema>,
                                    'confirmPassword'
                                >;
                            }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>ConfirmPassword</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter your password again' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>



                    <div>
                        <Button
                            type='submit'
                            size='lg'
                            disabled={form.formState.isSubmitting}
                            variant='default'
                            className='button col-span-2 w-full'>
                            {form.formState.isSubmitting ? 'Submitting...' : 'Sign Up'}
                        </Button>
                    </div>


                </div>


            

            </form >

        </Form >
    );
};

export default SignUpForm;