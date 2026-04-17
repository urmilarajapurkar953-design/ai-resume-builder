import React from 'react'

const Footer = () => {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

            <footer className="flex flex-col items-center justify-around w-full py-16 text-sm bg-green-50 text-green-900/80">
                
                {/* Logo */}
                <img src="/logo.svg" alt="lolgo" className='h-11 w-auto' />

                {/* Copyright */}
                <p className="mt-4 text-center">
                    Copyright © 2025 
                    <a href="#" className="text-green-700 font-medium hover:underline ml-1">
                        Resume builder
                    </a>. All rights reserved.
                </p>

                {/* Links */}
                <div className="flex items-center gap-4 mt-6">
                    <a href="#" className="font-medium text-green-800 hover:text-green-600 transition-all">
                        Brand Guidelines
                    </a>

                    <div className="h-4 w-px bg-green-800/30"></div>

                    <a href="#" className="font-medium text-green-800 hover:text-green-600 transition-all">
                        Trademark Policy
                    </a>
                </div>
            </footer>
        </>
    )
}

export default Footer