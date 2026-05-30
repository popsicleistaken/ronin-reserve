import LoginForm from "./LoginForm";

export const metadata = { title: "เข้าสู่ระบบ | Ronin Admin" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-primary">
            Ronin Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Management Portal</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <h2 className="mb-6 font-heading text-xl font-semibold text-foreground">
            เข้าสู่ระบบ
          </h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
