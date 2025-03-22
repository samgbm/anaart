import Image from 'next/image';
import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import CategoriesDrawer from './categories-drawer';
import Search from './search';


const Header = () => {
    return ( 
        <header className='w-full border-b'>
            <div className='wrapper flex-between'>


                <div className='flex-start'>
                    <CategoriesDrawer />
                    <Link href='/' className='flex-start ml-4'>
                        <Image
                            priority={true}
                            src='/images/lunalogo2.jpg'
                            width={48}
                            height={48}
                            alt={`${APP_NAME} logo`}
                            className="rounded-full"    
                        />
                        <span className="hidden lg:block font-extrabold text-2xl ml-3 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            {APP_NAME}
                        </span>
                    </Link>
                </div>




                <div className='hidden md:block'>
                    <Search />
                </div>
                <Menu />
            </div>
        </header>
    );
}
 
export default Header;