import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-stone-950 text-stone-100">
      <section className="relative isolate">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_38%),linear-gradient(135deg,_rgba(120,53,15,0.6),_rgba(12,10,9,0.96)_50%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.45em] text-amber-400">
                Hotel Bajrang, Mako, Latehar
              </p>
              <h1 className="font-display max-w-xl text-5xl leading-none text-stone-50 sm:text-6xl">
                Dubey&apos;s Dhaba
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-stone-300 sm:text-base">
                A straightforward dhaba-style stop for hearty Indian food, quick table service,
                and a menu built around familiar favorites.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/menu"
                  className="rounded-full bg-amber-400 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-stone-950 transition hover:bg-amber-300"
                >
                  Open Menu
                </Link>
                <a
                  href="https://maps.google.com/?q=Hotel+Bajrang+Mako+Latehar"
                  className="rounded-full border border-stone-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-stone-100 transition hover:border-stone-500 hover:bg-stone-900"
                >
                  View Location
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-amber-400/20 blur-3xl" />
              <div className="absolute -right-6 bottom-4 h-28 w-28 rounded-full bg-red-500/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-stone-400">Featured</p>
                    <h2 className="font-display mt-2 text-2xl">House Picks</h2>
                  </div>
                  <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                    Fresh Daily
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ["Butter Chicken", "Rich tomato gravy with tandoori char"],
                    ["Paneer Tikka", "Smoky paneer with mellow spice"],
                    ["Chicken Biryani", "Dum-cooked rice layered with masala"],
                    ["Masala Chai", "Strong chai with ginger and cardamom"]
                  ].map(([name, detail]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                    >
                      <div>
                        <h3 className="font-display text-base text-stone-100">{name}</h3>
                        <p className="mt-1 text-sm text-stone-400">{detail}</p>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                        Popular
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-stone-100 p-4 text-stone-950">
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-stone-500">Address</p>
                  <p className="font-display mt-2 text-lg">
                    Hotel Bajrang, Mako, Latehar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
