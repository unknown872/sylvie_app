import React from 'react';
import Image from 'next/image';
import HeroImage from "@/assets/HeroImage.png";
import First from "@/assets/eau-perfume.png";
import Second from "@/assets/beau-perfume.png";
import Third from "@/assets/bottle-parfum.png";
import Fourth from "@/assets/blue-orange.png";
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import { FaWhatsappSquare } from 'react-icons/fa';
import Link from 'next/link';

const images = [
    { src: First },
    { src: Second },
    { src: Third },
    { src: Fourth },
];

export default function Hero() {
    const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));

    return (
        <>
            <section className="relative h-96 md:h-[600px] lg:h-screen flex flex-col items-center overflow-hidden justify-center text-white">
                {/* Image de fond avec superposition */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <Image src={HeroImage} alt="Image de fond" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                </div>

                {/* Contenu principal et carousel alignés */}
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-center w-full max-w-screen-xl px-8 space-y-8 md:space-y-0 md:space-x-8">
                    {/* Contenu principal */}
                    <div className="w-full relative md:w-1/2 space-y-6 md:absolute md:-top-40 md:left-10 z-10">
                        <div className='space-y-4 z-50 relative text-center md:text-left'>
                            <h3 className="text-4xl md:text-6xl font-montserrat font-bold">SMELL AS YOU FEEL</h3>
                            <p className="font-poppins text-sm md:text-lg">
                                Découvrez nos parfums de qualité, des créations exquises pour éveiller vos sens et sublimer chaque instant. Laissez-vous transporter par des notes raffinées qui expriment votre personnalité avec élégance.
                            </p>
                            <button className="before:ease relative h-12 w-40 border-2 overflow-hidden border-white shadow-2xl before:absolute before:left-0 before:-ml-2 before:h-48 before:w-48 before:origin-top-right before:-translate-x-full before:translate-y-12 before:-rotate-90 before:bg-gray-900 before:transition-all before:duration-300 hover:text-white  hover:shadow-black hover:before:-rotate-180">
                                <span className="relative font-cabin font-semibold">DÉCOUVRIR</span>
                            </button>
                        </div>
                        <div className='md:hidden absolute left-16 -top-16 z-0 opacity-60'>
                            <Carousel plugins={[plugin.current]} opts={{ align: "start", loop: true }}>
                                <CarouselContent className="space-x-0 border-none">
                                    {images.map((image, index) => (
                                        <CarouselItem key={index} className="p-0 border-none">
                                            <Card className="bg-transparent shadow-none border-none">
                                                <CardContent className="p-0 border-none">
                                                    <Image
                                                        src={image.src}
                                                        alt={`Image ${index + 1}`}
                                                        width={250}
                                                        height={250}
                                                        priority={index === 0}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        </div>
                    </div>

                    {/* Carousel */}
                    <div className="w-full hidden md:block md:w-1/2 mb-44 md:pl-36 md:absolute md:-top-[180px] lg:-top-80 md:right-0">
                        <Carousel plugins={[plugin.current]} opts={{ align: "start", loop: true }}>
                            <CarouselContent className="space-x-0 border-none">
                                {images.map((image, index) => (
                                    <CarouselItem key={index} className="p-0 border-none">
                                        <Card className="bg-transparent shadow-none border-none">
                                            <CardContent className="p-0 border-none">
                                                <Image
                                                    src={image.src}
                                                    alt={`Image ${index + 1}`}
                                                    width={500}
                                                    height={500}
                                                    priority={index === 0}
                                                />
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </section>
        </>
    );
}
