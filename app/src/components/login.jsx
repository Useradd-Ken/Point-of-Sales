import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";

const slides = [
  {
    src: "/h3.jpg",
    eyebrow: "Drop 04 — Out now",
    title: "Wear the streets,\nown the silence.",
    caption: "Crafted heavyweight fleece. Built for everyday rituals.",
  },
  {
    src: "/h4.jpg",
    eyebrow: "Essentials",
    title: "Cream meets\nforest deep.",
    caption: "Two tones. Endless rotations. Quietly loud.",
  },
  {
    src: "/h1.jpg",
    eyebrow: "Texture study",
    title: "Detail is the\nwhole story.",
    caption: "Tipped drawcords. Brushed interiors. Considered weight.",
  },
];

export default function LoginPage() {
  const [active, setActive] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", { email, password });
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto grid min-h-screen w-full max-w-[1980px] grid-cols-1 lg:grid-cols-2">
        
        {/* Left — credentials */}
        <section className="flex flex-col justify-between px-8 py-10 sm:px-12 lg:px-16 xl:px-24">
          
          {/* Logo Header */}
          <header className="mb-12 lg:mb-0">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#546B41] from-neutral-200 to-neutral-400 text-[#FFF8EC]">
                <span className="text-lg font-bold leading-none">H</span>
              </div>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#546B41]">
                HoodStock
              </span>
            </div>
          </header>

          {/* Center Form Section — Fixed tight margins, added spacious padding layout */}
          <div className="my-auto w-full max-w-md py-12 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
              Authorized personnel only
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-black sm:text-5xl lg:text-6xl">
              Welcome <em className="font-serif italic text-[#546B41] font-normal">back</em>.
            </h1>

            <p className="text-base leading-relaxed text-[#99AD7A] mt-4 py-8">
              Sign in to track orders, manage your closet, and shop early drops.
            </p>

            {/* Input Clusters are now separated distinctly by space-y-6 */}
            <form onSubmit={onSubmit} className="space-y-6 py-2 p-3">
              
              {/* Email Input Block */}
              <div className="space-y-6">
                <label
                  htmlFor="email"
                  className="py-3 block text-xs font-medium uppercase tracking-wider text-neutral-400"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="krbwork@gmail.com"
                    className="h-12 w-full rounded-xl border pl-11 pr-4 text-base text-[#546B41] placeholder:text-neutral-500 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="py-3 block text-xs font-medium uppercase tracking-wider text-neutral-400"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-[#546B41] hover:underline transition-colors"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border pl-11 pr-11 text-base text-[#546B41] placeholder:text-neutral-500 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-300"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Keep Me Signed In Checkbox */}
              <div className="flex items-center gap-3 pt-3 py-3">
                <input
                  type="checkbox"
                  id="remember"
                  className="size-4 rounded border-neutral-800 bg-neutral-900 accent-neutral-200 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="cursor-pointer text-sm select-none text-neutral-400 hover:text-neutral-300 transition-colors"
                >
                  Keep me signed in on this device
                </label>
              </div>

              {/* Form Actions */}
              <div className="pt-2 space-y-4">
                <button
                  type="submit"
                  className="cursor-pointer group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#546B41] text-sm font-semibold tracking-wide text-white transition hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign in
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>

                {/* Divider Line */}
                <div className="relative py-3">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#546B41]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-xs uppercase tracking-[0.24em] text-[#546B41]">
                      or
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  className="cursor-pointer flex h-12 w-full items-center justify-center gap-3 rounded-xl border text-sm font-medium text-[#99AD7A] transition hover:bg-neutral-900 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="size-4 shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.1A6.99 6.99 0 0 1 5.47 12c0-.73.13-1.44.36-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-neutral-400">
              New to HoodStock?{" "}
              <a href="#" className="pt-6 font-medium text-[#99AD7A] hover:underline transition-colors">
                Create an account
              </a>
            </p>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-between text-xs text-neutral-500 pt-6 border-t border-neutral-900/60 lg:border-t-0 lg:pt-0">
            <span>© {new Date().getFullYear()} HoodStock</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-neutral-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-neutral-300 transition-colors">Terms</a>
            </div>
          </footer>
        </section>

        {/* Right — carousel */}
        <aside className="relative hidden overflow-hidden p-6 lg:block">
          <div className="relative h-full w-full overflow-hidden rounded-3xl bg-neutral-900">
            {slides.map((s, i) => (
              <div
                key={s.src}
                className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={s.src}
                  alt=""
                  className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${
                    i === active ? "scale-105" : "scale-100"
                  }`}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}

            {/* Tint + gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/25 via-transparent to-neutral-950/85" />

            {/* Caption */}
            <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-12">
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] opacity-80">
                {slides[active].eyebrow}
              </span>
              <h2 className="mt-3 whitespace-pre-line text-4xl font-bold tracking-tight leading-[1.1] sm:text-5xl">
                {slides[active].title}
              </h2>
              <p className="mt-4 max-w-md text-sm text-neutral-300 leading-relaxed">
                {slides[active].caption}
              </p>

              {/* Dots */}
              <div className="mt-8 flex items-center gap-2 p-8">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === active
                        ? "w-10 bg-white"
                        : "w-4 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}