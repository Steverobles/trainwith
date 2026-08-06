export default function SafetyBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M12 1.5c-.34 0-.68.09-.98.27L4.2 5.65a2 2 0 0 0-.95 1.7v5.02c0 5.02 3.13 9.42 7.83 11.02.6.2 1.24.2 1.84 0 4.7-1.6 7.83-6 7.83-11.02V7.35a2 2 0 0 0-.95-1.7l-6.82-3.88a1.98 1.98 0 0 0-.98-.27Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="text-sm text-amber-900">
        <p className="font-semibold">Training together, safely</p>
        <p className={compact ? "mt-1" : "mt-1 leading-relaxed"}>
          For athletes under 18, a parent or guardian should connect with the other family and be
          part of planning the meetup. Always train in public places — parks, school fields, or
          rec centers — and let someone know where you&apos;ll be.
        </p>
      </div>
    </div>
  );
}
