import { getQuizById } from '@/actions/quiz'

export default async function Quiz({ params }: { params: { id: string } }) {
  const quiz = await getQuizById(params.id)

  if (!quiz) {
    return <div>Quiz not found</div>
  }

  return (
    <div>
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>
    </div>
  )
}
