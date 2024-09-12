import React, { useState } from 'react';

export default function Footer() {
    const today = new Date();
    let currYear = today.getFullYear();

    return (
        <footer className="text-black py-2 fixed bottom-0 left-0 w-full shadow-md">
        <div className="container m-2 px-1">
            <h6 className="text-sm text-left">@Copyright {currYear} Rhema Marneni</h6>
        </div>
        </footer>
    );
}