import React from 'react'
import Navbar from './navbar'
import Sidebar from './sidebar'

export default function Layout({children}) {
    return (
        <div>
            <header>
                <Navbar />
            </header>
            <main className='bg-gray-50 h-screen'>
            <Sidebar />
                <div className="p-4 lg:ml-80 pt-20">
                    {children}
                </div>
            </main>
        </div>
    )
}
