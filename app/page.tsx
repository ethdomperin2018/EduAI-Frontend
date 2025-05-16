import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, BookOpen, Users, Trophy } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">EduLearn Pro</span>
            </Link>
            <nav className="ml-8 hidden space-x-6 md:flex">
              <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Courses
              </Link>
              <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Features
              </Link>
              <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary">
                About
              </Link>
            </nav>
          </div>
          <nav className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container flex flex-col items-center justify-center px-4 text-center md:px-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Transform Your Learning Journey
              </h1>
              <p className="mx-auto max-w-[700px] text-xl text-muted-foreground">
                Experience personalized education with AI-powered guidance and interactive learning tools
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">Start Learning Now</Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Courses
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-8">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm">10K+ Active Learners</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-sm">200+ Expert-Led Courses</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-sm">95% Success Rate</span>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full border-t bg-muted/50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Personalized Learning</h3>
                <p className="text-muted-foreground">
                  AI-driven curriculum adapts to your learning style and pace for optimal results
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Interactive Sessions</h3>
                <p className="text-muted-foreground">
                  Engage in real-time collaborative learning with peers and expert instructors
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Certified Achievement</h3>
                <p className="text-muted-foreground">
                  Earn industry-recognized certificates upon course completion
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Advanced Learning Interface</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Experience our innovative dual-screen learning environment with AI-powered guidance and interactive content delivery.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Real-time AI assistance</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Interactive learning materials</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Progress tracking & analytics</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] overflow-hidden rounded-xl border bg-background p-2 shadow-xl">
                <div className="flex h-[300px] w-full flex-col overflow-hidden rounded-md bg-muted">
                  <div className="flex h-full">
                    <div className="w-1/3 border-r bg-background p-4">
                      <div className="h-full rounded-md bg-muted"></div>
                    </div>
                    <div className="w-2/3 p-4">
                      <div className="h-full rounded-md bg-muted"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12 md:py-16">
        <div className="container flex flex-col items-center justify-between gap-8 px-4 md:px-6 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start md:gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg font-bold">EduLearn Pro</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transforming education through technology
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 md:items-end md:gap-2">
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EduLearn Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}