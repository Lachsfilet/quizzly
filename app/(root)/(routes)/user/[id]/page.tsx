import { getQuizzesByUserId } from '@/actions/quiz'
import { QuizCard } from '@/components/Quiz-Card'

export default async function Quiz({ params }: { params: { id: string } }) {
  const quizzes = await getQuizzesByUserId(params.id)

  if (!quizzes) {
    return <div>User not found</div>
  }

  return (
    <div>
      <QuizCard quizzes={quizzes} />
    </div>
  )
}
