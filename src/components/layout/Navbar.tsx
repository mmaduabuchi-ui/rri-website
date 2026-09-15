"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Global Presence", href: "/global-presence" },
  { name: "Humanity", href: "/welfare" },
  { name: "Get Involved", href: "/get-involved" },
  { name: "Knowledge Centre", href: "/knowledge-centre" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <nav
        className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo / Brand Container */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={closeMobileMenu}
            aria-label="Realise Reality Initiative home"
          >
            <Image
              src="/images/photo_2026-08-31_16-19-54.jpg"
              alt="Realise Reality Initiative logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
              priority
            />

            <div className="hidden sm:block">
              <span className="block text-sm font-bold tracking-wide text-[#0B1B3D]">
                REALISE REALITY
              </span>
              <span className="block text-xs font-medium tracking-wider text-[#1E824C]">
                INITIATIVE
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-[#0B1B3D]"
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/get-involved"
            className="rounded-lg bg-[#F7B500] px-4 py-2 text-sm font-bold text-[#0B1B3D] transition-all duration-200 hover:bg-[#dca200]"
          >
            Join Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[#0B1B3D] hover:bg-gray-100 lg:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="border-t border-gray-200 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="border-b border-gray-100 px-2 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#0B1B3D]"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/get-involved"
                onClick={closeMobileMenu}
                className="mt-4 rounded-lg bg-[#F7B500] px-5 py-3 text-center font-bold text-[#0B1B3D]"
              >
                Join Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}