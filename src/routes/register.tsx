import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border p-8 shadow-sm">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-black">C</div>
          <span className="font-bold text-lg">CampusLoop</span>
        </Link>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Join thousands of students trading locally.</p>
        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>First name</Label><Input className="mt-1.5" placeholder="Jordan" /></div>
            <div><Label>Last name</Label><Input className="mt-1.5" placeholder="Lee" /></div>
          </div>
          <div><Label>University email</Label><Input className="mt-1.5" type="email" placeholder="you@uni.edu" /></div>
          <div><Label>Password</Label><Input className="mt-1.5" type="password" placeholder="At least 8 characters" /></div>
          <Button className="w-full" size="lg">Create account</Button>
        </form>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Already a member? <Link to="/login" className="text-primary font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
