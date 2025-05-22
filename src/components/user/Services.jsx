import React from 'react'
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlinePayment } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
export default function Services() {

    const services = [
        {
            id: 1,
            title: "LIVRAISON RAPIDE",
            icon: <TbTruckDelivery className='w-8 h-8' />
        },
        {
            id: 2,
            title: "PAIEMENT SÉCURISÉ",
            icon: <MdOutlinePayment className='w-8 h-8' />
        },
        {
            id: 3,
            title: "SERVICE CLIENT : +221 78 101 61 71",
            icon: <RiCustomerService2Line className='w-8 h-8' />
        }
    ];

    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
        tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
        mobile: { breakpoint: { max: 768, min: 0 }, items: 1 } // Affiche un élément à la fois sur mobile
    };

    return (
        <div className='py-14'>
            <div className='hidden px-6 md:flex justify-between'>
                {services.map(service => (
                    <div key={service.id} className='flex items-center justify-center space-x-2'>
                        {service.icon}
                        <h1 className='font-poppins'>{service.title}</h1>
                    </div>
                ))}
            </div>
            <div className='md:hidden'>
                <Carousel
                    responsive={responsive}
                    autoPlay={true} // Active le slide automatique
                    autoPlaySpeed={3000} // Change d'élément toutes les 3 secondes
                    infinite={true} // Recommence en boucle
                    showDots={false} // Masque les points de navigation
                    swipeable={true}
                    draggable={true}
                    arrows={false}
                >
                    {services.map(service => (
                        <div key={service.id} className='flex items-center text-center justify-center space-x-2 px-4'>
                            <div className=''>{service.icon}</div>
                            <h1 className='font-poppins'>{service.title}</h1>
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    )
}
