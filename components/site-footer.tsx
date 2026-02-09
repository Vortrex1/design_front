import { Coffee } from "lucide-react"

const infoLinks = ["About Us", "Blog", "FAQ", "Promotions"]
const categoryLinks = ["Arabica", "Dark Roast", "Espresso Blends", "Single Origin"]

export function SiteFooter() {
  return (
    <footer className="bg-foreground pb-6 pt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Coffee className="h-5 w-5 text-accent" />
              <span className="text-lg font-bold text-primary-foreground">
                CoffeMaker
              </span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/50">
              The best products for your development and comfort. Working since 2025 with love for customers.
            </p>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">
              Information
            </h4>
            <ul className="flex flex-col gap-2.5">
              {infoLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-primary-foreground/50 transition-colors hover:text-primary-foreground"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">
              Categories
            </h4>
            <ul className="flex flex-col gap-2.5">
              {categoryLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-primary-foreground/50 transition-colors hover:text-primary-foreground"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">
              Contact
            </h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/50">
              <p>+38 (097) 422 7 345</p>
              <p>info@coffemaker.ua</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-xs text-primary-foreground/40">
            {"2025 CoffeMaker. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
