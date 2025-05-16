import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CoursesPage() {
  // Mock data for courses
  const courses = [
    {
      id: 1,
      title: "Introduction to Mathematics",
      description: "Learn the fundamentals of mathematics including algebra, geometry, and calculus.",
      progress: 75,
      chapters: 12,
      lessons: 36,
    },
    {
      id: 2,
      title: "Basic Science",
      description: "Explore the world of science with topics in physics, chemistry, and biology.",
      progress: 50,
      chapters: 10,
      lessons: 30,
    },
    {
      id: 3,
      title: "English Literature",
      description: "Discover classic and modern literature with comprehensive analysis and discussion.",
      progress: 25,
      chapters: 8,
      lessons: 24,
    },
  ]

  return (
    <div className="flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="h-3 bg-primary" style={{ width: `${course.progress}%` }} />
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div>{course.chapters} Chapters</div>
                <div>{course.lessons} Lessons</div>
              </div>
              <div className="mt-2 text-sm">Progress: {course.progress}%</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Continue Learning</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
