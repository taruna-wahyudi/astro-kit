import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import {ImageIcon, Maximize2, Palette, FileHeart} from "lucide-react"

const features = [
  {
    title: "Convert Images",
    description: "Transform your images between formats with just a few clicks. Support for PNG, JPG, WEBP, and more.",
    icon: ImageIcon,
    href: "/convert",
    gradient: "from-blue-500/20 to-cyan-400/20"
  },
  {
    title: "Resize Images",
    description: "Perfectly resize your images while maintaining quality. Batch processing available.",
    icon: Maximize2,
    href: "/resize",
    gradient: "from-purple-500/20 to-pink-400/20"
  },
  {
    title: "Compress Images",
    description: "Reduce image size without compromising quality using our smart compression tool. Optimize your images for faster loading and better performance.",
    icon: FileHeart,
    href: "/compress",
    gradient: "from-orange-500/20 to-amber-400/20"
  },
  {
    title: "Edit Images",
    description: "Professional-grade tools for enhancing and editing your images.",
    icon: Palette,
    href: "/edit",
    gradient: "from-green-500/20 to-emerald-400/20"
  }
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:60px_60px] dark:bg-grid-slate-400/[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

        <div className="container relative mx-auto px-4 py-10 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <ThemeToggle />
          </div>

          <div className="mt-8 text-center max-w-2xl mx-auto">
            <h1
              className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ASTRO KIT
            </h1>
            <p className="text-muted-foreground text-lg">
              The ultimate open-source toolkit for creators and developers.<br />
              From file conversion to experimental features, innovation starts here!
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.title}>
              <Card className="group relative p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`} />
                </div>

                <div className="relative flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-2xl bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
                    <feature.icon className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{feature.title}</h2>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-border py-12">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">100%</div>
            <div className="text-muted-foreground text-sm">Free to Use</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">4+</div>
            <div className="text-muted-foreground text-sm">Powerful Tools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">Fast</div>
            <div className="text-muted-foreground text-sm">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">Secure</div>
            <div className="text-muted-foreground text-sm">File Handling</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center space-y-4">
          <div className="text-muted-foreground/80">
            <p>© {new Date().getFullYear()} ASTRO KIT. Created by Taruna Wahyudi</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
