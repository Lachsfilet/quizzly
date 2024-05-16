import {
  getOptionsByQuestionId,
  getQuestionsByQuizId,
  getQuizById
} from '@/actions/quiz'

import { QuizView } from '@/components/Quiz-View'

export default async function Quiz({ params }: { params: { id: string } }) {
  const quiz = await getQuizById(params.id)

  if (!quiz) {
    return <div>Quiz not found</div>
  }

  const questions: any[] = await getQuestionsByQuizId(quiz.id)
  const optionsPromises = questions.map((q) => getOptionsByQuestionId(q.id))
  const optionsArray = await Promise.all(optionsPromises)

  return <QuizView questions={questions} optionsArray={optionsArray} />
}
