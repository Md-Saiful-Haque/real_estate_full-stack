import Link from "next/link";

const nav = [
  { href: "/explore", label: "Explore listings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/help", label: "Help & Support" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

const social = [
  { href: "https://twitter.com", label: "X" },
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://instagram.com", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="border-t border-card-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                N
              </span>
              NestFinder
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We connect serious buyers and sellers with verified listings, transparent data, and tools that make every
              step clearer—from first search to closing day.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>
                <a href="tel:+18005550199" className="hover:text-primary">
                  +1 (800) 555-0199
                </a>
              </li>
              <li>
                <a href="mailto:hello@nestfinder.example" className="hover:text-primary">
                  hello@nestfinder.example
                </a>
              </li>
              <li>1200 Market Street, Suite 400</li>
              <li>San Francisco, CA 94103</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Follow
            </h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {social.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-card-border px-2 text-xs font-semibold text-muted hover:border-primary hover:text-primary"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-card-border pt-8 text-center text-sm text-muted">
          © {new Date().getFullYear()} NestFinder. All rights reserved. MLS data is deemed reliable but not guaranteed.
        </div>
      </div>
    </footer>
  );
}
