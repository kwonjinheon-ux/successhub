import { AuthPanel } from "@/components/auth/AuthPanel";

export default function LoginPage() {
  return (
    <main className="page-shell">
      <AuthPanel mode="login" />
    </main>
  );
}
