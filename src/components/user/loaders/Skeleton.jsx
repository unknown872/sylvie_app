import React from 'react';

// Composant pour un seul skeleton d'article
const ProductSkeletonItem = () => {
    return (
        <div className="md:mx-2 bg-bgColor rounded shadow-lg relative animate-pulse overflow-hidden">
            <div className="flex flex-col justify-center items-center">
                {/* Image skeleton */}
                <div className="relative w-full h-80 bg-gray-300" />

                {/* Badge "Nouveauté" skeleton */}
                <div className="absolute top-0 left-0 bg-gray-400 rounded h-6 w-16 md:w-20" />

                {/* Contenu skeleton */}
                <div className="flex flex-col py-2 bg-white w-full">
                    {/* Volume skeleton */}
                    <div className="h-4 bg-gray-300 rounded w-16 mx-auto mb-2" />

                    <div className="pl-4">
                        {/* Nom du produit skeleton */}
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />

                        {/* Prix skeleton */}
                        <div className="h-6 bg-gray-400 rounded w-24 mt-1" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composant avec 4 skeletons alignés
const Skeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
            {[...Array(4)].map((_, index) => (
                <ProductSkeletonItem key={`skeleton-${index}`} />
            ))}
        </div>
    );
};

export default Skeleton;