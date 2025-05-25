import React from 'react';

export default function CollectionsSkeleton() {
    return (
        <div className='lg:flex lg:space-x-4 lg:px-6'>
            {/* Skeleton pour HOMMES */}
            <div className='lg:w-1/2 relative group overflow-hidden'>
                <div className="rounded-md w-full h-[600px] bg-gray-200 animate-pulse">
                    {/* Gradient shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
                <div className='absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-opacity-20 bg-black text-white'>
                    {/* Skeleton pour le titre */}
                    <div className='h-12 w-48 bg-gray-300 animate-pulse rounded-md'></div>
                    
                    {/* Skeleton pour le bouton */}
                    <div className='border border-gray-300 px-2 py-1 flex space-x-1 bg-gray-300/20 animate-pulse rounded'>
                        <div className="h-4 w-24 bg-gray-300 rounded"></div>
                        <div className="h-4 w-4 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Skeleton pour FEMMES */}
            <div className='lg:w-1/2 w-full relative group overflow-hidden'>
                <div className="rounded-md w-full h-[600px] bg-gray-200 animate-pulse">
                    {/* Gradient shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
                <div className='absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-opacity-20 bg-black text-white'>
                    {/* Skeleton pour le titre */}
                    <div className='h-12 w-48 bg-gray-300 animate-pulse rounded-md'></div>
                    
                    {/* Skeleton pour le bouton */}
                    <div className='border border-gray-300 px-2 py-1 flex space-x-1 bg-gray-300/20 animate-pulse rounded'>
                        <div className="h-4 w-24 bg-gray-300 rounded"></div>
                        <div className="h-4 w-4 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Ajoutez ces classes CSS personnalisées dans votre fichier globals.css ou tailwind.config.js
/*
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
*/