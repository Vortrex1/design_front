import { Globe, Truck, Gift } from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Best Varieties",
    description: "From plantations in Brazil, Colombia, and Ethiopia",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-day delivery available in your city",
  },
  {
    icon: Gift,
    title: "Gift Packaging",
    description: "Free packaging for your loved ones",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            Why Choose Us
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            We care about every step from bean to cup
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-card-foreground">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
