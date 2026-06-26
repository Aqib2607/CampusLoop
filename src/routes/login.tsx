import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Command, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/20">
      {/* ── Left panel: Immersive Brand Visual ── */}
      <div className="relative hidden lg:flex flex-1 flex-col justify-between overflow-hidden bg-foreground p-12">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-[image:var(--gradient-primary)] opacity-40 mix-blend-multiply" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/30 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/20 blur-[100px] rounded-full"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 w-fit group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg group-hover:bg-white/20 transition-all">
              <Command className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CampusLoop</span>
          </Link>

          <div className="mt-auto mb-32 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                V2 Enterprise Release
              </div>
              <h1 className="text-5xl font-black text-white leading-[1.1] text-balance mb-6">
                Your campus, <br />
                <span className="text-white/60">connected.</span>
              </h1>
              <p className="text-lg text-white/70 leading-relaxed font-medium">
                Sign in to access your verified university marketplace. Trade securely, chat
                instantly, and build your campus reputation.
              </p>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-12 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-10 w-10 rounded-full border-2 border-foreground bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-xs font-bold z-[${5 - i}]`}
                  >
                    U{i}
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-white/80">
                Join <strong className="text-white">12,000+</strong> students
              </div>
            </motion.div>
          </div>

          <div className="text-sm font-medium text-white/40 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Secure Academic Environment
          </div>
        </div>
      </div>

      {/* ── Right panel: Minimalist Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-background relative">
        {/* Subtle ambient light for dark mode */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none hidden dark:block" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-12 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow-primary)]">
              <Command className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CampusLoop</span>
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-muted-foreground font-medium">
              Please enter your details to sign in.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()} noValidate>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className={cn(
                  "transition-colors",
                  emailFocused ? "text-primary" : "text-foreground",
                )}
              >
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@university.edu"
                required
                aria-required="true"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className={cn(
                    "transition-colors",
                    pwFocused ? "text-primary" : "text-foreground",
                  )}
                >
                  Password
                </Label>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  aria-required="true"
                  aria-label="Password"
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  className="h-12 text-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  title={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <div className="relative flex items-start">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  aria-label="Remember me"
                  title="Remember me"
                  className="peer h-5 w-5 shrink-0 rounded-md border-2 border-muted-foreground/30 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary transition-all appearance-none cursor-pointer"
                />
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none stroke-white opacity-0 peer-checked:opacity-100 transition-opacity"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <Label
                htmlFor="remember"
                className="text-sm font-medium text-foreground cursor-pointer select-none"
              >
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              size="xl"
              className="w-full text-base font-bold shadow-md hover:shadow-lg rounded-[var(--radius-xl)]"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-10 text-center">
            <span className="text-muted-foreground font-medium">Don't have an account? </span>
            <Link
              to="/register"
              className="text-foreground font-bold hover:text-primary transition-colors hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
