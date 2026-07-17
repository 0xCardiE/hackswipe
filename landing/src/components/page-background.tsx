export function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -right-20 top-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,45,85,0.16),transparent_65%)] blur-2xl" />
      <div className="absolute -left-24 bottom-10 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(255,120,80,0.1),transparent_65%)] blur-2xl" />
      <svg
        className="absolute right-6 top-28 h-52 w-52 opacity-[0.06] md:right-16 md:top-36 md:h-72 md:w-72"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M100 178s-62-38-78-78C12 72 28 42 58 42c16 0 28 9 35 20 7-11 19-20 35-20 30 0 46 30 36 58-16 40-64 78-64 78z"
          stroke="#ff2d55"
          strokeWidth="10"
          strokeLinejoin="round"
        />
        <path
          d="M118 78l-28 44h22l-10 30 38-52h-24l12-22z"
          fill="#ff2d55"
          opacity="0.85"
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,45,85,0.2)] to-transparent" />
    </div>
  );
}
