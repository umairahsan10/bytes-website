"use client";

import React from 'react';
import VideoScroll from '@/components/VideoScroll';
import { Header } from '@/sections/Navbar';

const BrandFlowPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header transparentNav={true} logoOnly={true} />
      <VideoScroll />
    </div>
  );
};

export default BrandFlowPage; 