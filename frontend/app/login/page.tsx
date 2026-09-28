"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Label } from "@/components/ui";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"ADMIN" | "CARRIER">("ADMIN");
  const [email, setEmail] = useState("admin@harborflow.com");
  const [password, setPassword] = useState("admin123");
  const [company, setCompany] = useState("HarborFlow");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (mode === "register") {
        res = await authApi.register({ email, password, companyName: company });
      } else if (role === "ADMIN") {
        res = await authApi.login({ email, password });
      } else {
        res = await authApi.carrierLogin({ email, password });
      }
      localStorage.setItem("hf_token", res.token);
      localStorage.setItem("hf_user", JSON.stringify({ email: res.email, role: res.role }));
      toast.success(mode === "login" ? `Signed in as ${res.role}` : "Account created");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  function pickRole(r: "ADMIN" | "CARRIER") {
    setRole(r);
    if (r === "ADMIN") {
      setEmail("admin@harborflow.com");
      setPassword("admin123");
    } else {
      setEmail("[email protected]");
      setPassword("pass123");
    }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-background">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded bg-foreground text-background font-mono text-xs font-bold">H</div>
          <span className="font-mono text-sm font-semibold tracking-tight">harborflow</span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{mode === "login" ? "Sign in" : "Create account"}</CardTitle>
            <CardDescription>
              {mode === "login" ? "Choose your role and sign in." : "Provision a new operator account."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === "login" && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => pickRole("ADMIN")}
                  className={`flex items-center justify-center gap-2 h-9 rounded-md border text-xs font-medium transition-colors ${
                    role === "ADMIN"
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Operator
                </button>
                <button
                  type="button"
                  onClick={() => pickRole("CARRIER")}
                  className={`flex items-center justify-center gap-2 h-9 rounded-md border text-xs font-medium transition-colors ${
                    role === "CARRIER"
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Truck className="h-3.5 w-3.5" /> Carrier
                </button>
              </div>
            )}
            <form onSubmit={submit} className="space-y-3">
              <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div className="space-y-1.5"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
              {mode === "register" && (
                <div className="space-y-1.5"><Label htmlFor="company">Company</Label><Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required /></div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
                {mode === "login" ? `Sign in as ${role === "ADMIN" ? "Operator" : "Carrier"}` : "Create account"}
              </Button>
            </form>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
              <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => setMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? "Need an account?" : "Already registered?"}
              </button>
              <Link href="/" className="text-muted-foreground hover:text-foreground">← Home</Link>
            </div>
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground font-mono">
          {role === "ADMIN" ? "admin@harborflow.com · admin123" : "[email protected] · pass123"}
        </p>
      </div>
    </main>
  );
}