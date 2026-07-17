import { AppLogo } from "@/components/app-logo";
import { BrandName } from "@/components/brand-name";

export function ExtensionPreview() {
  return (
    <div className="anim-float relative mx-auto w-full max-w-md">
      {/* Stacked profile cards behind the panel */}
      <div className="pointer-events-none absolute -left-6 top-8 z-0 hidden w-44 sm:block md:-left-10">
        <div className="absolute inset-0 rotate-[-8deg] rounded-2xl bg-[#2a1a22] shadow-xl" />
        <div className="anim-card-rise relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3d2430] to-[#1a1016] p-3 shadow-2xl">
          <div className="mb-2 aspect-[3/4] rounded-xl bg-gradient-to-b from-[#ff6b8a]/35 to-[#1a1016]" />
          <p className="text-sm font-bold text-white">Alex, 27</p>
          <p className="text-[10px] text-white/55">2 km away</p>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-4 top-16 z-0 hidden w-40 sm:block md:-right-8">
        <div className="anim-swipe-right relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff2d55] to-[#8b1030] p-3 opacity-90 shadow-2xl">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/80">Like</p>
          <p className="text-sm font-bold text-white">Jordan, 24</p>
        </div>
      </div>

      <div className="card relative z-10 overflow-hidden border-[rgba(255,45,85,0.2)] bg-[#140d11] p-4 text-white shadow-[0_24px_60px_rgba(20,10,16,0.35)] md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AppLogo size={36} />
            <div>
              <p className="text-sm font-bold tracking-wide">
                <BrandName />
              </p>
              <p className="text-[11px] text-white/45">Side panel · Tinder</p>
            </div>
          </div>
          <div className="text-right">
            <span className="rounded-full border border-[rgba(255,45,85,0.45)] bg-[rgba(255,45,85,0.15)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#ff6b8a]">
              Trial
            </span>
            <p className="mt-1 text-[10px] text-white/45">2 days left</p>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[rgba(10,122,75,0.35)] bg-[rgba(10,122,75,0.12)] px-3 py-2.5 text-xs font-medium text-[#5ddea8]">
          <span className="anim-pulse-dot h-2 w-2 rounded-full bg-[#5ddea8]" />
          Swiping on tinder.com
        </div>

        <div className="mb-4 grid grid-cols-4 gap-2">
          {[
            { label: "Swipes", value: "148" },
            { label: "Likes", value: "97" },
            { label: "Nopes", value: "41" },
            { label: "Filtered", value: "12" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-center"
            >
              <p className="font-display text-lg font-bold leading-none text-white">{stat.value}</p>
              <p className="mt-1 text-[9px] uppercase tracking-wide text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mb-4 w-full rounded-full bg-[#ff2d55] px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(255,45,85,0.4)]"
          tabIndex={-1}
        >
          Stop Swiping
        </button>

        <div className="mb-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
            Active filters
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["18–32", "≤25 km", "3+ photos", "No spam bios"].map((chip) => (
              <span
                key={chip}
                className="rounded-lg border border-[rgba(255,45,85,0.35)] bg-[rgba(255,45,85,0.12)] px-2.5 py-1 text-[10px] font-semibold text-[#ff8aa3]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <p className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[11px] leading-relaxed text-white/55">
          Last action: liked <span className="font-semibold text-white">Sam, 26</span> · passed filters
        </p>
      </div>
    </div>
  );
}
