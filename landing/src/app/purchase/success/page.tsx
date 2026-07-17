"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AddToChromeLink } from "@/components/add-to-chrome-link";
import { product } from "@/config/product";

interface VerifyResponse {
  ok?: boolean;
  paid?: boolean;
  email?: string;
  licenseKey?: string | null;
  message?: string;
  error?: string;
  emailed?: boolean;
  emailProvider?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [data, setData] = useState<VerifyResponse | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      setData({ error: "Missing checkout session. Return to pricing and try again." });
      return;
    }

    let cancelled = false;

    async function verify() {
      const id = sessionId;
      if (!id) return;

      try {
        const response = await fetch(`/api/purchase/verify?session_id=${encodeURIComponent(id)}`);
        const json = (await response.json()) as VerifyResponse;

        if (cancelled) return;

        if (!response.ok) {
          setState("error");
          setData(json);
          return;
        }

        setData(json);
        setState("ready");
      } catch {
        if (!cancelled) {
          setState("error");
          setData({ error: "Could not verify payment." });
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <section className="relative z-10 mx-auto max-w-2xl px-5 py-20">
      <div className="card p-8 md:p-10">
        {state === "loading" ? (
          <>
            <h1 className="section-title mb-3">Confirming payment…</h1>
            <p className="text-[var(--muted)]">This usually takes a few seconds.</p>
          </>
        ) : null}

        {state === "ready" && data?.paid ? (
          <>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">Payment successful</p>
            <h1 className="section-title mb-3">Your {product.proName} license</h1>
            <p className="section-lead mb-6">
              {data.message || "Copy your license key below and activate it in the extension."}
            </p>

            {data.licenseKey ? (
              <div className="mb-6 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-muted)] p-5">
                <p className="mb-2 text-sm font-semibold text-[var(--text)]">License key</p>
                <code className="block break-all rounded-lg bg-white px-4 py-3 text-lg tracking-wide text-[var(--text)]">
                  {data.licenseKey}
                </code>
                {data.email ? (
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    Purchased as <strong>{data.email}</strong>. We also emailed this key to you.
                  </p>
                ) : null}
              </div>
            ) : null}

            <ol className="mb-8 space-y-2 text-sm text-[var(--muted)]">
              <li>1. Open {product.name} in Chrome</li>
              <li>2. Go to Settings → License</li>
              <li>3. Enter your email and license key, then click Activate</li>
            </ol>

            <div className="flex flex-wrap gap-3">
              <AddToChromeLink className="btn-primary">
                Install the extension
              </AddToChromeLink>
              <Link href="/pricing" className="btn-secondary">
                Back to pricing
              </Link>
            </div>
          </>
        ) : null}

        {state === "error" ? (
          <>
            <h1 className="section-title mb-3">Something went wrong</h1>
            <p className="mb-6 text-[var(--muted)]">
              {data?.error || "We could not confirm your purchase."}
            </p>
            <p className="text-sm text-[var(--muted)]">
              See the{" "}
              <Link href="/faq" className="text-[var(--accent)] hover:underline">
                FAQ
              </Link>{" "}
              for purchase and activation help.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/pricing" className="btn-primary">
                Try again
              </Link>
              <Link href="/" className="btn-secondary">
                Back to homepage
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="relative z-10 mx-auto max-w-2xl px-5 py-20">
          <div className="card p-8">
            <h1 className="section-title mb-3">Loading…</h1>
          </div>
        </section>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
