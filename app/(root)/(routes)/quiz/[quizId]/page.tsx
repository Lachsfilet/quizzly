'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  getOptionsByQuestionId,
  getQuestionsByQuizId,
  getQuizById
} from '@/actions/quiz'
import { QuizView } from '@/components/Quiz-View'
import toast from 'react-hot-toast'
import { Question } from '@/interfaces/question'
import { Option } from '@/interfaces/option'

interface Quiz {
  id: string
  title: string
  description: string
  createdAt: Date
}

export default function QuizPage({ params }: { params: { quizId: string } }) {
  const router = useRouter()
  const { quizId } = params
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [optionsArray, setOptionsArray] = useState<Option[][]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function fetchQuizData() {
      const fetchedQuiz = await getQuizById(quizId)
      if (!fetchedQuiz) {
        toast.error('Quiz not found')
        router.push('/discover')
        return
      }

      setQuiz(fetchedQuiz as Quiz)

      const fetchedQuestions = await getQuestionsByQuizId(quizId)
      setQuestions(fetchedQuestions)

      const optionsPromises = fetchedQuestions.map((q) =>
        getOptionsByQuestionId(q.id)
      )
      const fetchedOptionsArray = await Promise.all(optionsPromises)
      setOptionsArray(fetchedOptionsArray)
    }

    fetchQuizData()
  }, [quizId, router])

  if (!quiz || questions.length === 0 || optionsArray.length === 0) {
    return <div>Loading...</div>
  }

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      toast.success('Right')
    } else {
      toast.success('Quiz completed!')
    }
  }

  return (
    <QuizView
      question={questions[currentIndex]}
      optionsArray={optionsArray[currentIndex]}
      questionIndex={currentIndex + 1}
      questionLength={questions.length}
      onNextQuestion={handleNextQuestion}
    />
  )
}
