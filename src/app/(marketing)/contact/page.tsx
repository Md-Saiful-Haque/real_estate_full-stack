import { ContactForm } from "./ContactForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">Contact NestFinder</h1>
      <p className="mt-4 text-sm text-muted">
        Brokerage partnerships, press, and product questions all route through the same team so nothing gets lost between inboxes.
      </p>
      <p className="mt-2 text-sm text-muted">
        Phone:{" "}
        <a href="tel:+18005550199" className="font-semibold text-primary hover:underline">
          +1 (800) 555-0199
        </a>
        <br />
        Email:{" "}
        <a href="mailto:hello@nestfinder.example" className="font-semibold text-primary hover:underline">
          hello@nestfinder.example
        </a>
      </p>
      <ContactForm />
    </div>
  );
}
