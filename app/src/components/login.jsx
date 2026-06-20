import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [active, setActive] = useState(1); // Defaulted to index 1 to match your screenshot
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

    if (!res.ok) {
  setError(data.error || 'Login failed');
  return;
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  if (data.user.role.toLowerCase() === 'admin') {
  navigate('/Dashboard/dashboardHome');
  } else {
  navigate('/Dashboard/sales');
  }
} catch (err) {
  setError('Unable to login. Please try again.');
}
};

  return (
    <main className="min-h-screen bg-white text-neutral-800 antialiased selection:bg-emerald-100">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-1 lg:grid-cols-2">
        
        {/* Left Column — Clean Credentials Panel */}
        <section className="flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20">
          
          {/* Brand Header */}
          <header className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-900 text-white font-bold">
              <span>H</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-950">
              HoodStock
            </span>
          </header>

          {/* Form Content Wrapper */}
          <div className="mx-auto my-auto w-full max-w-sm py-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Members only
            </span>
            
            <h1 className="mt-2 text-4xl font-normal tracking-tight text-emerald-950 sm:text-5xl">
              Welcome <em className="font-serif italic text-[#546B41] font-medium">back</em>.
            </h1>
            
            <p className="mt-4 text-sm leading-relaxed text-emerald-900">
              Sign in to track orders, manage your closet, and shop early drops.
            </p>

            <form onSubmit={onSubmit} className="mt-12 space-y-6">
              
              {/* Minimalist Bottom-Border Email Input */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 py-4">
                  Email
                </label>
                <div className="relative border-b border-neutral-200 focus-within:border-emerald-800 transition-colors">
                  <Mail className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    id="email"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="kenrdworkd@gmail.com"
                    className="rounded-lg h-11 w-full bg-transparent pl-7 pr-4 text-sm text-neutral-800 placeholder:text-neutral-300"
                  />
                </div>
              </div>

              {/* Minimalist Bottom-Border Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 py-4">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-emerald-800 hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative border-b border-neutral-200 focus-within:border-emerald-800 transition-colors">
                  <Lock className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-neutral-400 " />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-lg h-11 w-full bg-transparent pl-7 pr-10 text-sm text-neutral-800 placeholder:text-neutral-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Round Custom Checkbox Option */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="size-4 rounded-full border-neutral-300 text-emerald-800 accent-emerald-800 cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-neutral-500 cursor-pointer select-none ">
                  Keep me signed in on this device
                </label>
              </div>

              {/* Solid Rich Green Button Group */}
              <div className="pt-4 space-y-4">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="cursor-pointer group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#546B41] text-sm font-semibold tracking-wide text-white transition-all hover:bg-emerald-950 shadow-sm"
                >
                  Sign in
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* Subtle Text-Only Divider */}
                <div className="text-center py-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                    or
                  </span>
                </div>

                {/* Clean Google Integration Row */}
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-100 bg-neutral-50/50 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50"
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

            <p className="mt-8 text-center text-xs text-neutral-500 py-4">
              New to HoodStock?{" "}
              <a href="#" className="font-bold text-[#546B41] hover:underline">
                Create an account
              </a>
            </p>
          </div>

          {/* Footer block */}
          <footer className="flex items-center justify-between text-[11px] font-medium text-neutral-400">
            <span>© {new Date().getFullYear()} HoodStock</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-neutral-600">Privacy</a>
              <a href="#" className="hover:text-neutral-600">Terms</a>
            </div>
          </footer>
        </section>

        {/* Right Column — Elegant High-Contrast Media Gallery */}
        <aside className="relative hidden p-5 lg:block">
          <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-emerald-950">
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
                    i === active ? "scale-102" : "scale-100"
                  }`}
                  loading={i === 1 ? "eager" : "lazy"}
                />
              </div>
            ))}

            {/* Seamless, Soft Gradient Drop Shadow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent" />

            {/* Slide Information Panel */}
            <div className="absolute inset-x-0 bottom-0 p-12 text-white xl:p-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-300/90">
                {slides[active].eyebrow}
              </span>
              <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.15] tracking-tight text-white xl:text-5xl">
                {slides[active].title}
              </h2>
              <p className="mt-4 max-w-sm text-xs font-light leading-relaxed text-neutral-200/80">
                {slides[active].caption}
              </p>

              {/* Progress Slider Dots */}
              <div className="mt-8 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === active ? "w-8 bg-white" : "w-4 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Pill Header Live Stream Badge */}
          
          </div>
        </aside>
      </div>
    </main>
  );
}