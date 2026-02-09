import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ProductsSection } from "@/components/products-section"
import { VideoSection } from "@/components/video-section"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <ProductsSection />
      <VideoSection />
      <FeaturesSection />
      <SiteFooter />
    </main>
  )
}
