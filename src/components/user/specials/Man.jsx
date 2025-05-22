import React from 'react';
import Video from 'next-video';
import Tom from '@/videos/Tom.mp4';
import { FaArrowRight } from 'react-icons/fa';


export default function Man() {
    return (
        <section className="relative h-[500px] flex flex-col items-center justify-center text-center text-white">
            <div className="absolute inset-0 overflow-hidden">
                <video
                    className="absolute top-1/2 left-1/2 w-auto h-[500px] min-w-full min-h-full max-w-none transform -translate-x-1/2 -translate-y-1/2 object-cover"
                    src="/videos/Tom.mp4"
                    type="video/mp4"
                    autoPlay
                    muted
                    loop
                ></video>
            </div>

            <div className="relative z-10 space-y-3 flex flex-col justify-center items-center">
                <h2 className="font-semibold font-poppins text-3xl">NOTRE COLLECTION SPECIALE</h2>
                <h3 className="font-poppins font-thin text-xl">POUR HOMME</h3>
                <button className='bg-opacity-0 border border-white px-2 py-1 flex space-x-1'>
                    <span className="relative font-cabin text-sm">DÉCOUVRIR</span>
                    <FaArrowRight className='pt-1' />
                </button>
            </div>
        </section>

    );
}