"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Global Presence", href: "/global-presence" },
  { name: "Our Team", href: "/team" },
  { name: "Get Involved", href: "/get-involved" },
  { name: "Insights", href: "/insights" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleAudio = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (videoRef.current) {
      const nextMuteState = !videoRef.current.muted;
      videoRef.current.muted = nextMuteState;
      setIsMuted(nextMuteState);

      if (!nextMuteState) {
        videoRef.current.play().catch((err) => {
          console.warn("Playback failed:", err);
          setIsMuted(true);
          videoRef.current!.muted = true;
        });
      }
    }
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
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              {!hasVideoError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setHasVideoError(true)}
                  className="h-full w-full object-cover"
                >
                  <source
                    src="/images/video_2026-08-31_20-53-41.mp4"
                    type="video/mp4"
                  />
                  <Image
                    src="/images/photo_2026-08-31_16-19-54.jpg"
                    alt="Realise Reality Initiative logo"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                    priority
                  />
                </video>
              ) : (
                <Image
                  src="/images/photo_2026-08-31_16-19-54.jpg"
                  alt="Realise Reality Initiative logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                  priority
                />
              )}
            </div>

            <div className="hidden sm:block">
              <span className="block text-sm font-bold tracking-wide text-[#0B1B3D]">
                REALISE REALITY
              </span>
              <span className="block text-xs font-medium tracking-wider text-[#1E824C]">
                INITIATIVE
              </span>
            </div>
          </Link>

          {/* Dedicated Active Audio Toggle Button */}
          {!hasVideoError && (
            <button
              type="button"
              onClick={toggleAudio}
              className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-[#F7B500] hover:text-[#0B1B3D] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#F7B500]"
              title={isMuted ? "Unmute Logo Sound" : "Mute Logo Sound"}
              aria-label={isMuted ? "Unmute Logo Sound" : "Mute Logo Sound"}
            >
              {isMuted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.414 0-.75-.336-.75-.75V9.75c0-.414.336-.75.75-.75h4.24Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4 text-[#1E824C]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.287a6 6 0 0 1 0 8.486M11.25 5.25l-4.72 4.72H4.51c-.414 0-.75.336-.75.75v4.5c0 .414.336.75.75.75h2.02l4.72 4.72V5.25Z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-[#0B1B3D] focus-visible:text-[#0B1B3D]"
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/get-involved"
            className="rounded-lg bg-[#F7B500] px-5 py-2.5 text-sm font-bold text-[#0B1B3D] transition-all duration-200 hover:bg-[#dca200] focus-visible:ring-2 focus-visible:ring-[#F7B500] focus-visible:ring-offset-2"
          >
            Join Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[#0B1B3D] hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#F7B500] lg:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span className="sr-only">
            {mobileMenuOpen ? "Close menu" : "Open menu"}
          </span>

          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
              aria-hidden="true"
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
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
              aria-hidden="true"
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
        <div
          id="mobile-navigation"
          className="border-t border-gray-200 bg-white lg:hidden"
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="border-b border-gray-100 px-2 py-3.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#0B1B3D]"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/get-involved"
                onClick={closeMobileMenu}
                className="mt-4 rounded-lg bg-[#F7B500] px-5 py-3 text-center font-bold text-[#0B1B3D] transition-colors hover:bg-[#dca200]"
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