"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AuthButton() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        console.error("Unable to get current Supabase user:", error.message);
        return;
      }

      if (isMounted) {
        setIsSignedIn(Boolean(user));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsSignedIn(Boolean(session?.user));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Unable to sign out of Supabase:", error.message);
      return;
    }

    window.location.href = "/";
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-[#0B1B3D]"
        >
          Dashboard
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-[#F7B500] px-4 py-2 text-sm font-bold text-[#0B1B3D] transition-all duration-200 hover:bg-[#dca200]"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-lg bg-[#F7B500] px-4 py-2 text-sm font-bold text-[#0B1B3D] transition-all duration-200 hover:bg-[#dca200]"
    >
      Login
    </Link>
  );
}