"use client";

import { useRef, useState } from "react";

export default function VideoLogo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  const toggleAudio = () => {
    if (!videoRef.current) return;

    const nextMuteState = !videoRef.current.muted;
    videoRef.current.muted = nextMuteState;
    setIsMuted(nextMuteState);

    if (!nextMuteState) {
      videoRef.current.play().catch(() => {
        setIsMuted(true);
        if (videoRef.current) videoRef.current.muted = true;
      });
    }
  };

  return (
    <section className="bg-[#F5F7FA] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E824C]">
            Our Identity
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl lg:text-5xl">
            The RRI logo in motion.
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            A symbol of clarity, truth, and conscious living—brought to life.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center">
          {!hasError ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                onError={() => setHasError(true)}
                className="h-48 w-48 rounded-full object-cover shadow-2xl ring-4 ring-white sm:h-64 sm:w-64 lg:h-80 lg:w-80"
              >
                <source
                  src="/images/video_2026-08-31_20-53-41.mp4"
                  type="video/mp4"
                />
              </video>

              <button
                type="button"
                onClick={toggleAudio}
                aria-label={isMuted ? "Unmute logo sound" : "Mute logo sound"}
                title={isMuted ? "Unmute Logo Sound" : "Mute Logo Sound"}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-[#0B1B3D] px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-[#122856] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B500] focus-visible:ring-offset-2"
              >
                {isMuted ? (
                  <>
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
                    Unmute
                  </>
                ) : (
                  <>
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
                        d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.287a6 6 0 0 1 0 8.486M11.25 5.25l-4.72 4.72H4.51c-.414 0-.75.336-.75.75v4.5c0 .414.336.75.75.75h2.02l4.72 4.72V5.25Z"
                      />
                    </svg>
                    Mute
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Video unavailable. Please refresh the page.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}