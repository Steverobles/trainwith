export default function SafetyBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold">Training together, safely</p>
      <p className={compact ? "mt-1" : "mt-1 leading-relaxed"}>
        For athletes under 18, a parent or guardian should connect with the other family and be
        part of planning the meetup. Always train in public places — parks, school fields, or
        rec centers — and let someone know where you&apos;ll be.
      </p>
    </div>
  );
}
