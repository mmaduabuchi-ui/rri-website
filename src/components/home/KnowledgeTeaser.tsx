"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function KnowledgeTeaser() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    let isMounted = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (isMounted) setIsSignedIn(Boolean(user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setIsSignedIn(Boolean(session?.user));
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <section className="bg-[#0B1B3D] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F7B500]">
            Knowledge Centre
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Books, articles, and resources for clear thinkers.
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg">
            Access our growing library of books, publications, and daily
            articles designed to encourage critical thinking, personal growth,
            and conscious living.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/knowledge-centre"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F7B500] px-7 py-3.5 text-base font-bold text-[#0B1B3D] transition-colors duration-200 hover:bg-[#dca200]"
            >
              Enter Knowledge Centre
            </Link>

            {mounted && !isSignedIn && (
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-7 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-white/10"
              >
                Create an account
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}