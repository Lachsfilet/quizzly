'force-dynamic'
import { QuizCard } from '@/components/Quiz-Card'
import { getAllQuizzes } from '@/actions/quiz'
import { CreateQuiz } from '@/components/Create-Quiz'

export interface Quiz {
  id: string
  title: string
  description: string | null
  userId: string
  createdAt: Date
}

export default async function Discover() {
  const unmappedQuizzes: Quiz[] = await getAllQuizzes()

  const quizzes = unmappedQuizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    userId: quiz.userId,
    createdAt: quiz.createdAt
  }))

  console.log(quizzes)

  return (
    <div>
      <QuizCard quizzes={quizzes} />
      <CreateQuiz />
    </div>
  )
}
