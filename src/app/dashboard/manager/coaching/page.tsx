export const metadata = { title: "Coaching notes" };

export default function ManagerCoachingPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground">Coaching notes</h1>
      <p className="mt-2 text-sm text-muted">
        Document weekly feedback for each agent: tone on tours, follow-up speed, and accuracy of listing details. Export to PDF for broker review.
      </p>
      <div className="mt-8 rounded-2xl border border-card-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">This week&apos;s focus</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>Confirm every buyer receives a written summary within four hours of a showing.</li>
          <li>Practice explaining HOA transfer fees using plain language, not acronyms alone.</li>
          <li>Record two call snippets for peer review—one strong, one to improve.</li>
        </ul>
      </div>
    </div>
  );
}
