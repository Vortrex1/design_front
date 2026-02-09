import Image from "next/image"

const categories = [
  {
    name: "Arabica",
    description: "Smooth, aromatic beans with complex flavor profiles",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop",
  },
  {
    name: "Dark Roast",
    description: "Bold, full-bodied coffee with rich, smoky undertones",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=600&h=400&fit=crop",
  },
  {
    name: "Espresso Blends",
    description: "Perfectly balanced blends for the ultimate espresso shot",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=400&fit=crop",
  },
  {
    name: "Single Origin",
    description: "Unique flavors sourced from specific coffee-growing regions",
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&h=400&fit=crop",
  },
]

export function ProductsSection() {
  return (
    <section id="products" className="bg-card py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-card-foreground md:text-4xl text-balance">
            Our Coffee Collection
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Explore our carefully curated selection of premium coffees
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-lg font-bold text-foreground">
                  {category.name}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
