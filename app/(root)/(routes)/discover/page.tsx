export const revalidate = 0
import { QuizCard } from '@/components/Quiz-Card'
import { getAllQuizzes } from '@/actions/quiz'
import { CreateQuiz } from '@/components/Create-Quiz'
import { Separator } from '@/components/ui/separator'
import { getUserById } from '@/data/user'

export interface Quiz {
  id: string
  title: string
  description: string | null
  userId: string
  createdAt: Date
}

export interface UserInfo {
  name: string
  image: string
}

export interface QuizWithUserInfo {
  id: string
  title: string
  description: string | null
  userId: string
  createdAt: Date
  user: UserInfo
}

export default async function Discover() {
  const unmappedQuizzes: Quiz[] = await getAllQuizzes()

  const quizzes: QuizWithUserInfo[] = (await Promise.all(
    unmappedQuizzes.map(async (quiz) => {
      const user = await getUserById(quiz.userId);
  
      if (!user) {
        return undefined;
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
      };
    })
  )).filter((quiz): quiz is QuizWithUserInfo => quiz !== undefined);
  
  return (
    <div>
      <div className="px-4 mx-auto sm:px-6">
        <div>
          <div className="text-center pb-5 pt-32" data-aos="fade-up">
            <h1 className="font-bold text-6xl mx-6"> Discover</h1>
            <p className="text-md text-slate-100/40 pt-1">
              Create && discover quizzes here.
            </p>
            <div className="flex items-center justify-center">
              <Separator className="mt-8 bg-slate-100/20 h-0.5 w-40" />
            </div>
          </div>
        </div>
      </div>
      <QuizCard quizzes={quizzes} />
      <CreateQuiz />
    </div>
  )
}
