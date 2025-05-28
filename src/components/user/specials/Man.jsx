import React, { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';

export default function Man() {
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 5000); // 5 secondes pour bien voir

        return () => clearTimeout(timer);
    }, []);

    // Skeleton intégré directement
    if (showSkeleton) {
        return (
            <section className="relative h-[500px] flex flex-col items-center justify-center text-center text-white">
                {/* Skeleton pour la vidéo de fond */}
                <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400">
                    {/* Icône play au centre pour indiquer une vidéo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-500/50 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                    </div>
                </div>

                {/* Skeleton pour le contenu texte */}
                <div className="relative z-10 space-y-3 flex flex-col justify-center items-center">
                    {/* Skeleton pour le titre principal */}
                    <div className="h-8 w-80 bg-white/40 rounded-md animate-pulse"></div>

                    {/* Skeleton pour le sous-titre */}
                    <div className="h-6 w-32 bg-white/40 rounded-md animate-pulse"></div>

                    {/* Skeleton pour le bouton */}
                    <div className="border border-white/60 px-2 py-1 flex space-x-1 bg-white/20 rounded animate-pulse">
                        <div className="h-4 w-20 bg-white/40 rounded"></div>
                        <div className="h-4 w-4 bg-white/40 rounded"></div>
                    </div>
                </div>
            </section>
        );
    }

    // Contenu normal
    return (
        <section className="relative h-[500px] flex flex-col bg-gray-800 items-center justify-center text-center text-white">
            <div className="absolute inset-0 overflow-hidden">
                <video
                    className="absolute top-1/2 left-1/2 w-auto h-[500px] min-w-full min-h-full max-w-none transform -translate-x-1/2 -translate-y-1/2 object-cover"
                    src="/videos/Tom.mp4"
                    type="video/mp4"
                    autoPlay
                    muted
                    loop
                    preload="metadata"
                />
            </div>

            <div className="relative z-10 space-y-3 flex flex-col justify-center items-center">
                <h2 className="font-semibold font-poppins text-3xl">NOTRE COLLECTION SPECIALE</h2>
                <h3 className="font-poppins font-thin text-xl">POUR HOMME</h3>
                <button className='bg-opacity-0 border border-white px-2 py-1 flex space-x-1 hover:bg-white/10 transition-colors duration-300'>
                    <span className="relative font-cabin text-sm">DÉCOUVRIR</span>
                    <FaArrowRight className='pt-1' />
                </button>
            </div>
        </section>
    );
}