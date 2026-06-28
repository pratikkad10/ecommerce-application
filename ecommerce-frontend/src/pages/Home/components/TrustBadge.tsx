export function TrustBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
      <span className="material-symbols-outlined text-primary">{icon}</span>{" "}
      {text}
    </div>
  );
}
