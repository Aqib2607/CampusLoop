import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-foreground text-primary font-black">
            C
          </div>
          <span className="font-bold text-lg">CampusLoop</span>
        </Link>
        <div>
          <h2 className="text-4xl font-black leading-tight">
            Welcome back to your campus marketplace.
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-md">
            Pick up where you left off — your conversations, saved items and listings are waiting.
          </p>
        </div>
        <div className="text-sm text-primary-foreground/70">© CampusLoop</div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold">Log in</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Use your university email to continue.
          </p>
          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@uni.edu" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="pw">Password</Label>
              <Input id="pw" type="password" placeholder="••••••••" className="mt-1.5" />
            </div>
            <Button className="w-full" size="lg">
              Log in
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            New here?{" "}
            <Link to="/register" className="text-primary font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
