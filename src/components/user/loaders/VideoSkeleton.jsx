import React from 'react';

export default function VideoSkeleton() {
    return (
        <section className="relative h-[500px] flex flex-col items-center justify-center text-center text-white">
            {/* Skeleton pour la vidéo de fond */}
            <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400 animate-pulse">
                {/* Effet shimmer pour la vidéo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                
                {/* Icône play au centre pour indiquer une vidéo */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-500/30 rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-0 h-0 border-l-[12px] border-l-gray-400 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                </div>
            </div>

            {/* Skeleton pour le contenu texte */}
            <div className="relative z-10 space-y-3 flex flex-col justify-center items-center">
                {/* Skeleton pour le titre principal */}
                <div className="h-8 w-80 bg-gray-300 animate-pulse rounded-md"></div>
                
                {/* Skeleton pour le sous-titre */}
                <div className="h-6 w-32 bg-gray-300 animate-pulse rounded-md"></div>
                
                {/* Skeleton pour le bouton */}
                <div className="border border-gray-300 px-2 py-1 flex space-x-1 bg-gray-300/20 animate-pulse rounded">
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    <div className="h-4 w-4 bg-gray-300 rounded"></div>
                </div>
            </div>
        </section>
    );
}