export const metadata = { title: "Pipeline" };

export default function ManagerPipelinePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground">Regional pipeline</h1>
      <p className="mt-2 text-sm text-muted">
        Managers use this view to coach agents on warm leads. Connect your CRM to hydrate live stages—below is the workflow we recommend while integrations are configured.
      </p>
      <ol className="mt-8 list-decimal space-y-4 pl-5 text-sm text-muted">
        <li>
          <strong className="text-foreground">Qualify:</strong> confirm financing, timing, and must-have features within twenty-four hours of each tour request.
        </li>
        <li>
          <strong className="text-foreground">Nurture:</strong> share comparable sales and inspection summaries before the buyer removes contingencies.
        </li>
        <li>
          <strong className="text-foreground">Close:</strong> align title, escrow, and walk-through dates in a single shared checklist visible to the buyer.
        </li>
      </ol>
    </div>
  );
}
