import Link from 'next/link';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUserById, signOutUser } from '@/lib/actions/user.actions';
import Image from 'next/image';


const UserButton = async () => {

    const session = await auth();
    if (!session) {
        return (
            <Link href='/api/auth/signin'>
                <Button>Sign In</Button>
            </Link>
        );
    }


    const userId = session?.user?.id;
    const {images} = await getUserById(userId!);

    const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U';

    return (
        <div className='flex gap-2 items-center'>

            <DropdownMenu>



                <DropdownMenuTrigger asChild>
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-300 p-0"
                        >
                            {images[0] ? (<Image
                                key={images[0]}
                                src={images[0]}
                                alt="user image"
                                className="w-full h-full object-cover rounded-full"
                                width={32}
                                height={32}
                            />) : firstInitial}
                        </Button>
                    </div>
                </DropdownMenuTrigger>





                <DropdownMenuContent className='w-56' align='end' forceMount>

                    <DropdownMenuLabel className='font-normal'>
                        <div className='flex flex-col space-y-1'>
                            <p className='text-sm font-medium leading-none'>
                                {session.user?.name}
                            </p>
                            <p className='text-xs leading-none text-muted-foreground'>
                                {session.user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>



                    <DropdownMenuItem>
                        <Link className="w-full" href="/user/profile">
                            User Profile
                        </Link>
                    </DropdownMenuItem>



                    <DropdownMenuItem>
                        <Link className='w-full' href='/user/orders'>
                            Order History
                        </Link>
                    </DropdownMenuItem>


                    {
                        session?.user?.role === 'admin' && (
                            <DropdownMenuItem>
                                <Link className='w-full' href='/admin/overview'>
                                    Admin
                                </Link>
                            </DropdownMenuItem>
                        )
                    }


                    <DropdownMenuItem className='p-0 mb-1'>
                        <form action={signOutUser} className='w-full'>
                            <Button
                                className='w-full py-4 px-2 h-4 justify-start'
                                variant='ghost'
                            >
                                Sign Out
                            </Button>
                        </form>
                    </DropdownMenuItem>




                </DropdownMenuContent>
            </DropdownMenu>
        </div>);



};

export default UserButton;