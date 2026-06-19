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
  const [active, setActive] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigation hook

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // FRONTEND FILTER: If trying to log in as admin, enforce the @gmail.com rule
    if (username.toLowerCase().startsWith("admin") && !username.endsWith("@gmail.com")) {
      setError("Admin accounts must log in with their valid @gmail.com email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials.");
      }

      // Save token & user context to browser memory
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // REDIRECT: Navigates to your Dashboard route layout mapping
      navigate("/Dashboard");
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto grid min-h-screen w-full max-w-[1980px] grid-cols-1 lg:grid-cols-2">
        
        {/* Left — credentials */}
        <section className="flex flex-col justify-between px-8 py-10 sm:px-12 lg:px-16 xl:px-24">
          
          <header className="mb-12 lg:mb-0">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#546B41] text-[#FFF8EC]">
                <span className="text-lg font-bold leading-none">H</span>
              </div>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#546B41]">
                HoodStock
              </span>
            </div>
          </header>

          <div className="my-auto w-full max-w-md py-12 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
              Authorized personnel only
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-black sm:text-5xl lg:text-6xl">
              Welcome <em className="font-serif italic text-[#546B41] font-normal">back</em>.
            </h1>

            <p className="text-base leading-relaxed text-[#99AD7A] mt-4 py-4">
              Sign in to track orders, manage your closet, and shop early drops.
            </p>

            {/* Error Message Display */}
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6 py-2 p-3">
              
              {/* Username Input Block */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-xs font-medium uppercase tracking-wider text-neutral-400"
                >
                  Username / Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin@gmail.com or cashier_user"
                    className="h-12 w-full rounded-xl border pl-11 pr-4 text-base text-[#546B41] placeholder:text-neutral-500 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium uppercase tracking-wider text-neutral-400"
                  >
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-[#546B41] hover:underline">Forgot?</a>
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Keep Me Signed In Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remember"
                  className="size-4 rounded border-neutral-800 bg-neutral-900 accent-neutral-200 cursor-pointer"
                />
                <label htmlFor="remember" className="cursor-pointer text-sm text-neutral-400 hover:text-neutral-300">
                  Keep me signed in on this device
                </label>
              </div>

              {/* Form Actions */}
              <div className="pt-2 space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#546B41] text-sm font-semibold tracking-wide text-white transition hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-400 disabled:translate-y-0"
                >
                  {loading ? "Signing in..." : "Sign in"}
                  {!loading && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
                </button>
              </div>
            </form>
          </div>

          <footer className="flex items-center justify-between text-xs text-neutral-500 pt-6">
            <span>© {new Date().getFullYear()} HoodStock</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-neutral-300">Privacy</a>
              <a href="#" className="hover:text-neutral-300">Terms</a>
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
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/25 via-transparent to-neutral-950/85" />
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
              <div className="mt-8 flex items-center gap-2 p-8">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === active ? "w-10 bg-white" : "w-4 bg-white/40 hover:bg-white/70"
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