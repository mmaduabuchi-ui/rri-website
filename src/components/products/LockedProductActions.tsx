// src/components/products/LockedProductActions.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import PaymentModal from "./PaymentModal";

type Props = {
  productId: string;
  productTitle: string;
  isSignedIn: boolean;
};

export default function LockedProductActions({
  productId,
  productTitle,
  isSignedIn,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      {isSignedIn ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F7B500] px-7 py-3.5 font-bold text-[#0B1B3D] transition-colors hover:bg-[#dca200]"
        >
          How to pay &amp; unlock
        </button>
      ) : (
        <Link
          href="/login"
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#F7B500] px-7 py-3.5 font-bold text-[#0B1B3D] transition-colors hover:bg-[#dca200]"
        >
          Sign in to unlock
        </Link>
      )}

      <Link
        href="/knowledge-centre"
        className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-[#1E824C] px-7 py-3.5 font-semibold text-[#1E824C] transition-colors hover:bg-[#1E824C] hover:text-white"
      >
        Back to Knowledge Centre
      </Link>

      {open && (
        <PaymentModal
          productId={productId}
          productTitle={productTitle}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}