import {
  getOptionsByQuestionId,
  getQuestionsByQuizId,
  getQuizById
} from '@/actions/quiz'

import { QuizView } from '@/components/Quiz-View'

export default async function Quiz({
  params
}: {
  params: { quizId: string; questionIndex: number }
}) {
  const quiz = await getQuizById(params.quizId)

  if (!quiz) {
    return <div>Quiz not found</div>
  }

  const questions: any[] = await getQuestionsByQuizId(quiz.id)
  const optionsPromises = questions.map((q) => getOptionsByQuestionId(q.id))
  const optionsArray = await Promise.all(optionsPromises)

  console.log(optionsArray)

  return (
    <QuizView
      question={questions[params.questionIndex - 1]}
      optionsArray={optionsArray[params.questionIndex - 1]}
      questionIndex={params.questionIndex}
    />
  )
}
