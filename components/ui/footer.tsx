// components/ui/footer.tsx

import React, { useState, type FC, type ReactNode } from 'react';
import { cn } from '@/lib/utils'; // Assumes you have a `cn` utility
import { Input } from '@/components/ui/input'; // Assumes shadcn Input
import { Button } from '@/components/ui/button'; // Assumes shadcn Button

/**
 * Props for the Footer component.
 */
interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** The source URL for the company logo. */
  logoSrc: string;
  /** The name of the company, displayed next to the logo. */
  companyName?: string;
  /** A short description of the company. */
  description?: string;
  /** An array of objects for generating useful links. */
  usefulLinks?: { label: string; href: string }[];
  /** An array of objects for generating social media links. */
  socialLinks?: { label: string; href: string; icon: ReactNode }[];
  /** The title for the newsletter subscription section. */
  newsletterTitle?: string;
  /** Async function to handle email subscription. Should return `true` for success and `false` for failure. */
  onSubscribe?: (email: string) => Promise<boolean>;
}

/**
 * A responsive and theme-adaptive footer component with a newsletter subscription form.
 * Designed following shadcn/ui and 21st.dev best practices.
 */
export const Footer: FC<FooterProps> = ({
  logoSrc,
  companyName = 'MediQ Pharma Inc.',
  description = 'Empowering Philippine surgeons and healthcare institutions with world-class ophthalmic innovations, intraocular lenses, and nationwide clinical distribution.',
  usefulLinks = [
    { label: 'Products', href: '#products' },
    { label: 'Brands & Partners', href: '#brands' },
    { label: 'Contact Us', href: '#contact' },
    { label: 'Privacy Policy', href: '#contact' },
  ],
  socialLinks = [
    { label: 'Facebook', href: '#', icon: <DummyIcon /> },
    { label: 'Instagram', href: '#', icon: <DummyIcon /> },
    { label: 'Twitter (X)', href: '#', icon: <DummyIcon /> },
  ],
  newsletterTitle = 'Subscribe our newsletter',
  onSubscribe,
  className,
  ...props
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !onSubscribe || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onSubscribe(email);

    setSubscriptionStatus(success ? 'success' : 'error');
    setIsSubmitting(false);

    if (success) {
      setEmail('');
    }

    // Reset the status message after 3 seconds
    setTimeout(() => {
      setSubscriptionStatus('idle');
    }, 3000);
  };

  return (
    <footer
      className={cn(
        'bg-[#0a1d40]/95 text-[#f4f7fb] border-t border-[#72c5f8]/20',
        className
      )}
      {...props}
    >
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        {/* Company Info */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt={`${companyName} Logo`} className="h-10 w-10 rounded-full border border-[#72c5f8]/35 object-cover" />
            <span className="text-xl font-bold text-white">{companyName}</span>
          </div>
          <p className="text-sm text-[#9bb3cf] leading-relaxed">{description}</p>
        </div>

        {/* Useful Links */}
        <div className="md:justify-self-center">
          <h3 className="mb-4 text-base font-semibold text-white">Useful Link</h3>
          <ul className="space-y-2">
            {usefulLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-[#9bb3cf] transition-colors hover:text-[#72c5f8]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us */}
        <div className="md:justify-self-center">
          <h3 className="mb-4 text-base font-semibold text-white">Follow Us</h3>
          <ul className="space-y-2">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-label={link.label}
                  className="flex items-center gap-2 text-sm text-[#9bb3cf] transition-colors hover:text-[#72c5f8]"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="mb-4 text-base font-semibold text-white">{newsletterTitle}</h3>
          <form onSubmit={handleSubscribe} className="relative w-full max-w-sm">
            <div className="relative">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || subscriptionStatus !== 'idle'}
                required
                aria-label="Email for newsletter"
                className="pr-28 border-[#679cd0]/35 bg-[#06132c]/90 text-white placeholder:text-[#7aaee0]/60 focus-visible:ring-[#72c5f8]"
              />
              <Button
                type="submit"
                disabled={isSubmitting || subscriptionStatus !== 'idle'}
                className="absolute right-0 top-0 h-full rounded-l-none bg-[#3aa0db] hover:bg-[#72c5f8] text-[#06132c] font-semibold px-4"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
            {/* Advanced Animation Overlay */}
            {(subscriptionStatus === 'success' || subscriptionStatus === 'error') && (
              <div
                key={subscriptionStatus} // Re-trigger animation on status change
                className="animate-in fade-in absolute inset-0 flex items-center justify-center rounded-lg bg-[#06132c]/90 text-center backdrop-blur-sm border border-[#72c5f8]/35"
              >
                {subscriptionStatus === 'success' ? (
                  <span className="font-semibold text-[#72c5f8]">Subscribed! 🎉</span>
                ) : (
                  <span className="font-semibold text-red-400">Failed. Try again.</span>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </footer>
  );
};

// Dummy Icon: Replace with your actual icon library e.g., Lucide React
const DummyIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-[#72c5f8]"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

