import { AuthPanel } from "@/components/auth/AuthPanel";

export default function SignupPage() {
  return (
    <main className="page-shell">
      <AuthPanel mode="signup" />
    </main>
  );
}
