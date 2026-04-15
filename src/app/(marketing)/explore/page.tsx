import { Suspense } from "react";
import { ExploreClient } from "./ExploreClient";

export const metadata = {
  title: "Explore listings",
};

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted">
          Loading search…
        </div>
      }
    >
      <ExploreClient />
    </Suspense>
  );
}
