import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Command,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({ component: RegisterPage });

const roles = [
  {
    id: "student",
    label: "Student",
    desc: "Undergrad or postgrad",
    icon: GraduationCap,
    color: "text-primary",
  },
  {
    id: "teacher",
    label: "Faculty",
    desc: "Professor or teacher",
    icon: BookOpen,
    color: "text-success",
  },
  {
    id: "staff",
    label: "Staff",
    desc: "University employee",
    icon: Briefcase,
    color: "text-warning",
  },
] as const;

function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<string>("student");
  const [showPw, setShowPw] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [fnFocused, setFnFocused] = useState(false);
  const [lnFocused, setLnFocused] = useState(false);

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/20">
      {/* ── Left panel: Immersive Brand Visual ── */}
      <div className="relative hidden lg:flex flex-1 flex-col justify-between overflow-hidden bg-foreground p-12">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-40 mix-blend-multiply" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-20%] w-[120%] h-[120%] bg-primary/20 blur-[130px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-primary/30 blur-[120px] rounded-full"
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
                <Zap className="h-3.5 w-3.5 text-yellow-400" />
                Join your campus today
              </div>
              <h1 className="text-5xl font-black text-white leading-[1.1] text-balance mb-6">
                Start trading <br />
                <span className="text-white/60">in seconds.</span>
              </h1>
              <p className="text-lg text-white/70 leading-relaxed font-medium">
                Create a free account to access exclusive student-only deals, textbooks, and more
                from your verified university community.
              </p>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-12 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-fit">
                <ShieldCheck className="h-8 w-8 text-success" />
                <div>
                  <div className="text-sm font-bold text-white">Verified Students Only</div>
                  <div className="text-xs text-white/70 font-medium">
                    Safe & secure trading environment.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-sm font-medium text-white/40 flex items-center gap-2">
            © {new Date().getFullYear()} CampusLoop Inc.
          </div>
        </div>
      </div>

      {/* ── Right panel: Minimalist Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-background relative overflow-y-auto">
        {/* Subtle ambient light for dark mode */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none hidden dark:block" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="w-full max-w-md relative z-10 py-10"
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
              Create an account
            </h2>
            <p className="text-muted-foreground font-medium">
              Join thousands of students trading locally.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()} noValidate>
            {/* Role Selector */}
            <div className="space-y-3">
              <Label className="text-foreground">I am a...</Label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((role) => {
                  const isActive = selectedRole === role.id;
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={cn(
                        "relative flex flex-col items-center gap-2 rounded-[var(--radius-xl)] border-2 p-3 text-center transition-all duration-300 outline-none",
                        isActive
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-muted/40",
                      )}
                    >
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-0.5 shadow-sm"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div
                        className={cn(
                          "p-2 rounded-xl transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div
                          className={cn(
                            "text-xs font-bold",
                            isActive ? "text-primary" : "text-foreground",
                          )}
                        >
                          {role.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className={cn(
                    "transition-colors",
                    fnFocused ? "text-primary" : "text-foreground",
                  )}
                >
                  First name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="Jordan"
                  required
                  aria-label="First name"
                  onFocus={() => setFnFocused(true)}
                  onBlur={() => setFnFocused(false)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className={cn(
                    "transition-colors",
                    lnFocused ? "text-primary" : "text-foreground",
                  )}
                >
                  Last name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  autoComplete="family-name"
                  placeholder="Lee"
                  required
                  aria-label="Last name"
                  onFocus={() => setLnFocused(true)}
                  onBlur={() => setLnFocused(false)}
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className={cn(
                  "transition-colors",
                  emailFocused ? "text-primary" : "text-foreground",
                )}
              >
                University email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@university.edu"
                required
                aria-label="University email"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className={cn("transition-colors", pwFocused ? "text-primary" : "text-foreground")}
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  aria-label="Password"
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  className="h-12 pr-12"
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

            <div className="flex items-start gap-3 py-2">
              <div className="relative flex items-start mt-0.5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  aria-label="Terms and conditions"
                  title="Terms and conditions"
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
                htmlFor="terms"
                className="text-sm font-medium text-foreground cursor-pointer select-none leading-relaxed"
              >
                I agree to the{" "}
                <Link to="/" className="text-primary hover:underline underline-offset-4">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/" className="text-primary hover:underline underline-offset-4">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              size="xl"
              className="w-full text-base font-bold shadow-md hover:shadow-lg rounded-[var(--radius-xl)]"
            >
              Create account
            </Button>
          </form>

          <div className="mt-10 text-center">
            <span className="text-muted-foreground font-medium">Already have an account? </span>
            <Link
              to="/login"
              className="text-foreground font-bold hover:text-primary transition-colors hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
