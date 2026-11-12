// components/ui/footer-demo.tsx

import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Footer } from '@/components/ui/footer';

const FooterDemo = () => {
  /**
   * A mock function to simulate an API call for newsletter subscription.
   * Returns a promise that resolves to true (success) or false (failure).
   */
  const handleNewsletterSubscribe = async (email: string): Promise<boolean> => {
    console.log(`Subscribing ${email}...`);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return true;
  };

  const socialLinksData = [
    { label: 'Facebook', href: '#', icon: <Facebook className="h-5 w-5 text-[#72c5f8]" /> },
    { label: 'Instagram', href: '#', icon: <Instagram className="h-5 w-5 text-[#72c5f8]" /> },
    { label: 'Twitter (X)', href: '#', icon: <Twitter className="h-5 w-5 text-[#72c5f8]" /> },
  ];

  return (
    <div className="w-full bg-[#0a1d40]">
      <Footer
        logoSrc="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=160&q=80"
        companyName="MediQ Pharma Inc."
        onSubscribe={handleNewsletterSubscribe}
        socialLinks={socialLinksData}
      />
    </div>
  );
};

export default FooterDemo;

