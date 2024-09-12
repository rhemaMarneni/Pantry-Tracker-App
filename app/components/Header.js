import React, { useState } from 'react';

export default function Header() {
  return (
    <header className="bg-green-700 text-white py-4 z-50 fixed top-0 left-0 w-full shadow-md">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center">My Pantry</h1>
      </div>
    </header>
  );
  }