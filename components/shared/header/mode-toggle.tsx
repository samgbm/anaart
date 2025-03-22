'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bird, Heart, Leaf, MoonIcon, PawPrint, SunIcon, SunMoon } from 'lucide-react';

const ModeToggle = () => {

    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }


    return (

        <DropdownMenu>


            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                    {theme === 'system' ? (
                        <SunMoon />
                    ) : theme === 'dark' ? (
                        <MoonIcon />
                    ) : theme === 'light' ? (
                        <SunIcon />
                    ) : theme === 'pink' ? (
                        <Heart />
                    ) : theme === 'blue' ? (
                        <Bird />
                    ) : theme === 'green' ? (
                        <Leaf />
                    ) : (<PawPrint />
                    )}


                </Button>
            </DropdownMenuTrigger>





            <DropdownMenuContent>

                <DropdownMenuLabel>Appearance</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem
                    checked={theme === 'pink'}
                    onClick={() => setTheme('pink')}
                >
                    Pink
                </DropdownMenuCheckboxItem>


                <DropdownMenuCheckboxItem
                    checked={theme === 'blue'}
                    onClick={() => setTheme('blue')}
                >
                    Blue
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                    checked={theme === 'system'}
                    onClick={() => setTheme('system')}
                >
                    System
                </DropdownMenuCheckboxItem>


                <DropdownMenuCheckboxItem
                    checked={theme === 'light'}
                    onClick={() => setTheme('light')}
                >
                    Light
                </DropdownMenuCheckboxItem>


                <DropdownMenuCheckboxItem
                    checked={theme === 'dark'}
                    onClick={() => setTheme('dark')}
                >
                    Dark
                </DropdownMenuCheckboxItem>

            </DropdownMenuContent>



        </DropdownMenu>

    );
}

export default ModeToggle;