import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const quickLinks = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Industries', href: '/industries' },
  { title: 'Careers', href: '/careers' },
  { title: 'Privacy & Policy', href: '/privacy-policy' },
  { title: 'Contact Us', href: '/contact' },
];

const servicesLinks = [
  { title: 'Web Development', href: '/services/web' },
  { title: 'SEO', href: '/services/seo' },
  { title: 'App Development', href: '/services/app' },
  { title: 'Marketing', href: '/services/marketing' },
  { title: 'Advanced Services', href: '/services/advanced-services' },
];

export const Footer = () => {
  return (
    <footer className="bg-[#010a14] text-gray-200 pt-16 pb-8 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl items-center mx-auto grid grid-cols-1 sm:grid-cols-2 gap-y-12 sm:gap-12 lg:flex lg:gap-12">
        {/* Logo / About */}
        <div className="lg:w-2/5 sm:col-span-2 mb-6 lg:mb-0 text-center sm:text-left">
          <Image src="/assets/bytes-logo.png" alt="Bytes Logo" width={140} height={40} className="mb-4 mx-auto sm:mx-0" />
          <p className="text-sm leading-relaxed max-w-xs">
            Bytes Platform delivers cutting-edge digital solutions that empower businesses to innovate and grow.
          </p>
        </div>

        {/* Quick Links */}
        <div className="lg:w-1/5 mb-6 lg:mb-0 text-center sm:text-left">
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3">
            {quickLinks.map((item) => (
              <li key={item.title}>
                <Link href={item.href} className="hover:text-white transition">{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="lg:w-1/5 mb-6 lg:mb-0 text-center sm:text-left">
          <h4 className="text-xl font-semibold mb-4">Services</h4>
          <ul className="space-y-3">
            {servicesLinks.map((item) => (
              <li key={item.title}>
                <Link href={item.href} className="hover:text-white transition">{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacts */}
        <div className="lg:w-1/5 mb-6 lg:mb-0 text-center sm:text-left">
          <h4 className="text-xl font-semibold mb-4">Contacts</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-4 justify-center sm:justify-start">
              <Phone size={16} />
              <Link href="tel:8333230371" className="hover:text-white transition">833-323-0371 (Toll Free)</Link>
            </li>
            <li className="flex items-center gap-4 justify-center sm:justify-start">
              <Mail size={16} />
              <Link href="mailto:info@bytesplatform.com" className="hover:text-white transition">info@bytesplatform.com</Link>
            </li>
            <li className="flex items-center gap-4 justify-center sm:justify-start">
              <MapPin size={16} />
              <Link
                href="https://www.google.com/maps/place/2809+Joshua+St,+Denton,+TX" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Bytes Platform LLC, 2809 Joshua Street, Denton, Texas, United States
              </Link>
            </li>
          </ul>
          {/* Socials */}
          <div className="flex gap-5 mt-4 justify-center sm:justify-start">
            <Link href="https://www.facebook.com/share/1BT8jkeBKK/?mibextid=wwXIfr" target="_blank" aria-label="Facebook" className="hover:text-white"><Facebook size={18} /></Link>
            <Link href="https://www.instagram.com/bytesplatform?igsh=aG50c3VvZmlrMG5o" target="_blank" aria-label="Instagram" className="hover:text-white"><Instagram size={18} /></Link>
            <Link href="#" aria-label="LinkedIn" className="hover:text-white"><Linkedin size={18} /></Link>
          </div>
        </div>
      </div>

      <hr className="border-white/20 my-8" />

      <p className="text-center text-sm">Developed by interns of Bytes Platform Inc.</p>
    </footer>
  );
};