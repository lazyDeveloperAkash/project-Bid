import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          {/* <Image src="/placeholder.svg?height=32&width=32" width={32} height={32} alt="Logo" className="h-8 w-8" /> */}
          <span className="ml-2 text-xl font-bold">ProjectBid</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/auth/signin" className="text-sm font-medium hover:underline underline-offset-4">
            Sign In
          </Link>
          <Link href="/auth/signup" className="text-sm font-medium hover:underline underline-offset-4">
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Connect. Bid. Deliver.
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    A platform where buyers post projects and sellers bid to win. Streamlined project management from
                    start to finish.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/signup">
                    <Button size="lg" className="gap-1">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              {/* <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="Hero Image"
                  className="rounded-lg object-cover"
                />
              </div> */}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6  mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform simplifies the project bidding process for both buyers and sellers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 md:gap-12">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">1</div>
                <h3 className="text-xl font-bold">Post a Project</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Buyers create detailed project listings with requirements and budget.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">2</div>
                <h3 className="text-xl font-bold">Receive Bids</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sellers submit competitive bids with their proposals and timelines.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">3</div>
                <h3 className="text-xl font-bold">Complete Projects</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track progress, submit deliverables, and finalize projects with ease.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 ProjectBid. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
