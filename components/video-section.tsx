const tags = ["#espresso", "#slowmo", "#coffeeart", "#baristalife"]

export function VideoSection() {
  return (
    <section className="relative overflow-hidden bg-foreground py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <span className="mb-4 inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
              Liquid Gold
            </span>
            <h2 className="mb-4 font-serif text-3xl font-bold text-primary-foreground md:text-5xl text-balance">
              The Art of Espresso
            </h2>
            <p className="mb-6 leading-relaxed text-primary-foreground/70">
              Every drop is a masterpiece. Pure coffee hypnosis in slow motion. From bean to cup, this is espresso magic.
            </p>
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary-foreground/20 px-3 py-1 text-sm text-primary-foreground/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Video embed */}
          <div className="w-full flex-1">
            <div className="overflow-hidden rounded-2xl border border-primary-foreground/10 shadow-2xl">
              <div className="relative" style={{ aspectRatio: "16/9" }}>
                <iframe
                  src="https://www.youtube.com/embed/j_tFfOY-mLE?si=QAHRVbEB-YvdZ5V4"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
