import { getQuizzesByUserId } from '@/actions/quiz'
import { getUserById } from '@/data/user'
import { QuizCard } from '@/components/Quiz-Card'
import { QuizWithUserInfo } from '@/app/(root)/(routes)/discover/page'

export default async function Quiz({ params }: { params: { id: string } }) {
  const unmappedQuizzes = await getQuizzesByUserId(params.id)

  if (!unmappedQuizzes) {
    return <div>User not found</div>
  }

  const quizzes: QuizWithUserInfo[] = (await Promise.all(
    unmappedQuizzes.map(async (quiz) => {
      const user = await getUserById(quiz.userId)

      if (!user) {
        return undefined
      }

      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        userId: quiz.userId,
        createdAt: quiz.createdAt,
        user: {
          name: user.name,
          image: user.image
        }
      }
    })
  )).filter((quiz): quiz is QuizWithUserInfo => quiz !== undefined)

  return (
    <div>
      <QuizCard quizzes={quizzes} />
    </div>
  )
}