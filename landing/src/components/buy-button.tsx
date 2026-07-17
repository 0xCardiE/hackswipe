"use client";

import { useState } from "react";

interface BuyButtonProps {
  label?: string;
  className?: string;
}

function friendlyCheckoutError(err: unknown, serverMessage?: string): string {
  if (serverMessage) return serverMessage;

  if (err instanceof Error) {
    const message = err.message.toLowerCase();
    if (message === "failed to fetch" || message.includes("network") || err.name === "TypeError") {
      return "Check your internet connection and try again.";
    }
    if (message === "checkout url missing.") {
      return "Checkout could not be started. Please try again in a moment.";
    }
    if (err.message && !message.startsWith("unexpected token")) {
      return err.message;
    }
  }

  return "Something went wrong. Please try again.";
}

export function BuyButton({ label = "Buy Lifetime license", className = "" }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/purchase/checkout", { method: "POST" });

      let data: { error?: string; url?: string } = {};
      try {
        data = (await response.json()) as { error?: string; url?: string };
      } catch {
        if (!response.ok) {
          throw new Error(`Checkout unavailable (${response.status}).`);
        }
        throw new Error("Unexpected response from checkout.");
      }

      if (!response.ok) {
        setError(friendlyCheckoutError(null, data.error));
        setLoading(false);
        return;
      }

      if (!data.url) {
        setError(friendlyCheckoutError(new Error("Checkout URL missing.")));
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      setError(friendlyCheckoutError(err));
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`btn-primary w-full sm:w-auto ${className}`.trim()}
        disabled={loading}
        onClick={handleClick}
      >
        {loading ? "Redirecting to checkout…" : label}
      </button>
      {error ? (
        <div
          role="alert"
          aria-live="polite"
          className="mt-3 w-full basis-full rounded-lg border border-[rgba(251,113,133,0.3)] bg-[rgba(127,29,29,0.25)] px-4 py-3"
        >
          <p className="text-sm font-semibold text-[#fecdd3]">Couldn&apos;t start checkout</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{error}</p>
        </div>
      ) : null}
    </>
  );
}
