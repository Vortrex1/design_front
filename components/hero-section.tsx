import { Coffee } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-foreground/60" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-2 backdrop-blur-sm">
          <Coffee className="h-4 w-4 text-primary-foreground" />
          <span className="text-sm font-medium tracking-wide text-primary-foreground">
            Premium Coffee
          </span>
        </div>

        <h1 className="mb-6 font-serif text-5xl font-bold leading-tight tracking-tight text-primary-foreground md:text-7xl">
          {"Freshly Roasted Coffee"}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-primary-foreground/80 md:text-xl">
          {"Premium varieties from the best corners of the world. From Brazil, Colombia, and Ethiopia straight to your cup."}
        </p>

        <Link
          href="#products"
          className="inline-flex items-center gap-2 rounded-full border-2 border-primary-foreground/80 px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary-foreground hover:text-foreground"
        >
          Browse Coffee
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-primary-foreground/40 p-1">
          <div className="h-2 w-1 animate-bounce rounded-full bg-primary-foreground/60" />
        </div>
      </div>
    </section>
  )
}
