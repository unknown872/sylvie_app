import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Man from "@/assets/man-perfum.jpg";
import Woman from "@/assets/woman-perfum.jpg";
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import CollectionsSkeleton from './loaders/CollectionSkeleton';

export default function Collections() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simuler un petit délai de chargement pour les images statiques
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000); // 500ms de skeleton

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <CollectionsSkeleton />;
    }

    return (
        <div className='lg:flex lg:space-x-4 lg:px-6'>
            <div className='lg:w-1/2 relative group overflow-hidden'>
                <Image
                    src={Man}
                    width={600}
                    height={600}
                    className="rounded-md w-full object-cover ease-in-out duration-500 group-hover:rotate-6 group-hover:scale-125"
                    priority
                />
                <div className='absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-opacity-20 bg-black text-white'>
                    <h2 className='text-5xl font-cardo'>HOMMES</h2>
                    <Link href="/shop/homme">
                        <button className='bg-opacity-0 border border-white px-2 py-1 flex space-x-1'>
                            <span className="relative font-poppins text-sm">DÉCOUVRIR</span>
                            <FaArrowRight className='pt-1' />
                        </button>
                    </Link>
                </div>
            </div>
            <div className='lg:w-1/2 w-full relative group overflow-hidden'>
                <Image
                    src={Woman}
                    width={600}
                    height={600}
                    className="rounded-md w-full object-cover ease-in-out duration-500 group-hover:rotate-6 group-hover:scale-125"
                    priority
                />
                <div className='absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-opacity-20 bg-black text-white'>
                    <h2 className='text-5xl font-cardo'>FEMMES</h2>
                    <Link href="/shop/femme">
                        <button className='bg-opacity-0 border border-white px-2 py-1 flex space-x-1'>
                            <span className="relative font-poppins text-sm">DÉCOUVRIR</span>
                            <FaArrowRight className='pt-1' />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
