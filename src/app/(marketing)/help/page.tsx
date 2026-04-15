import Link from "next/link";

export const metadata = { title: "Help & Support" };

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
      <p className="mt-4 text-sm text-muted">
        Quick answers for the most common questions from buyers and partner agents. Still stuck? Email{" "}
        <a href="mailto:help@nestfinder.example" className="text-primary hover:underline">
          help@nestfinder.example
        </a>
        .
      </p>
      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Searching and filters</h2>
          <p className="mt-2 text-sm text-muted">
            Combine keyword search with category, price, rating, and city filters. Filters apply instantly and respect pagination—use Next to walk through large result sets without loading everything at once.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Tours and inquiries</h2>
          <p className="mt-2 text-sm text-muted">
            Sign in, open a listing, and submit a viewing request with your questions attached. Listing teams see the property context alongside your note, which reduces duplicate emails.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Reviews</h2>
          <p className="mt-2 text-sm text-muted">
            You can leave one review per listing after your account has toured or purchased. Reviews power the average rating on each card—keep feedback specific so future buyers benefit.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">AI assistant</h2>
          <p className="mt-2 text-sm text-muted">
            The assistant offers general guidance about financing timelines and inspections. It does not provide legal advice—consult a licensed attorney for contract questions.{" "}
            <Link href="/assistant" className="font-semibold text-primary hover:underline">
              Open the assistant
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
