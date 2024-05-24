import {
  getOptionsByQuestionId,
  getQuestionsByQuizId,
  getQuizById
} from '@/actions/quiz'

import { QuizView } from '@/components/Quiz-View'
import { redirect } from 'next/navigation'

export default async function Quiz({
  params
}: {
  params: { quizId: string; questionIndex: number }
}) {
  const quiz = await getQuizById(params.quizId)
  const path = `/quiz/${params.quizId}`

  if (!quiz) {
    return <div>Quiz not found</div>
  }

  const questions: any[] = await getQuestionsByQuizId(quiz.id)
  const optionsPromises = questions.map((q) => getOptionsByQuestionId(q.id))
  const optionsArray = await Promise.all(optionsPromises)

  if (params.questionIndex > questions.length) {
    redirect(`/quiz/${params.quizId}/1`)
    return null
  }

  return (
    <QuizView
      question={questions[params.questionIndex - 1]}
      optionsArray={optionsArray[params.questionIndex - 1]}
      questionIndex={+params.questionIndex}
      questionLength={questions.length}
      path={path}
    />
  )
}
