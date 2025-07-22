"use client";

import Link from "next/link";
import Image from "next/image";
import logoSrc from "../../../assets/logo.svg";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col mb-4 group">
              <Image
                src={logoSrc}
                alt="Movie Zone Logo"
                width={40}
                height={40}
                className="mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              />
              <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                Movie Zone
              </h3>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md animate-fade-in">
              Discover the latest movies and TV series. Enjoy a premium viewing experience with a wide range of entertainment content.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="font-semibold mb-4 transition-colors duration-300 hover:text-primary">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/main-movies" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:pl-2 border-l-2 border-transparent hover:border-primary">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/main-series" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:pl-2 border-l-2 border-transparent hover:border-primary">
                  TV Series
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-semibold mb-4 transition-colors duration-300 hover:text-primary">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:pl-2 border-l-2 border-transparent hover:border-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:pl-2 border-l-2 border-transparent hover:border-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:pl-2 border-l-2 border-transparent hover:border-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:pl-2 border-l-2 border-transparent hover:border-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-border animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-muted-foreground mb-4 md:mb-0 transition-all duration-300 hover:text-foreground">
            © {new Date().getFullYear()} Movie Zone. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/devbn3li"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 transform hover:scale-105 relative overflow-hidden shine-effect"
            >
              <span className="relative z-10">Developed by devbn3li</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out shine-animation"></span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .shine-effect:hover .shine-animation {
          animation: shine 1s ease-out;
        }
        
        .shine-effect {
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          background-size: 200% 200%;
        }
        
        .shine-effect:hover {
          background-position: 100% 100%;
          transition: background-position 0.6s ease;
        }
      `}</style>
    </footer>
  );
}
