import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { TbMinusVertical } from "react-icons/tb";
import { FaPhoneAlt } from "react-icons/fa";

export default function Banner() {
    return (
        <div className='hidden lg:flex justify-between bg-black px-6 py-4'>
            <div className='flex text-sm font-poppins text-white space-x-2 text-white'>
                <FaLocationDot className='w-4 h-4' />
                <p className='font-semibold'>Médina 31x2 bis</p>
            </div>
            <div className='flex space-x-1 text-white'>
                <div className='flex text-sm font-poppins text-white space-x-2'>
                    <FaPhoneAlt className='w-5 h-5' />
                    <p>+221 78 101 61 71</p>
                </div>
                <TbMinusVertical className='h-6 w-6' />
                <div className='flex text-sm font-poppins text-white space-x-2'>
                    <MdEmail className='w-5 h-5' />
                    <p>senteurdesylvie@gmail.com</p>
                </div>
            </div>
            <div className='flex text-white space-x-4'>
                <FaTiktok />
                <FaInstagram />
                <FaFacebook />
            </div>
        </div>
    )
}
