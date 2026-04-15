import { AssistantChat } from "./AssistantChat";

export const metadata = { title: "AI Assistant" };

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">NestFinder AI Assistant</h1>
      <p className="mt-2 text-muted">
        Ask about financing timelines, inspection priorities, or how to compare two listings side by side. Responses prioritize U.S. practices and cite general guidance—not legal advice.
      </p>
      <AssistantChat />
    </div>
  );
}
