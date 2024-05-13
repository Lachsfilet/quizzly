export const dynamic = 'force-dynamic'
import { QuizCard } from '@/components/Quiz-Card'
import { getAllQuizzes } from '@/actions/quiz'

export interface Quiz {
  id: string
  title: string
  description: string | null
  userId: string
  createdAt: Date
}

export default async function Discover() {
  const quizzes: any = await getAllQuizzes()
  console.log(quizzes)

  return <QuizCard quizzes={quizzes} />
}
