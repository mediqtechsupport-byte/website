'use client';

import React from 'react';
import Component from '@/components/ui/image-reveal';

const ComponentDemo = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-12 p-8 bg-[#050d21] min-h-screen text-white w-full">
      <div className="flex justify-center w-full">
        <div className="flex flex-col items-center gap-4 border p-6 rounded-xl border-[#72c5f8]/25 bg-[#0a1d40]/90 shadow-lg w-full max-w-5xl">
          <h2 className="text-2xl font-semibold mb-2 text-[#f4f7fb]">
            Established Ophthalmic Principal &amp; Portfolio Preview
          </h2>
          <Component variant="blue-theme" />
        </div>
      </div>
    </div>
  );
};

export { ComponentDemo as DemoOne };
export default ComponentDemo;
