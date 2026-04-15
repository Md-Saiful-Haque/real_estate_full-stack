import { RegisterForm } from "./RegisterForm";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
}
