"use client";

import React from 'react';
import VideoScroll from '@/components/VideoScroll';
import { Header } from '@/sections/Navbar';
import { Footer } from '@/sections/Footer';

const BrandFlowPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header transparentNav={true} logoOnly={true} />
      <main className="flex-1">
        <VideoScroll />
      </main>
      <Footer />
    </div>
  );
};

export default BrandFlowPage; 