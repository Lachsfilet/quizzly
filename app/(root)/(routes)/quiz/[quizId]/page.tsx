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
import { useConfettiStore } from '@/lib/confetti'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Oval } from 'react-loader-spinner'

interface Quiz {
  id: string
  title: string
  description: string
  createdAt: Date
}

export default function QuizPage({ params }: { params: { quizId: string } }) {
  const router = useRouter()
  const confetti = useConfettiStore()
  const { quizId } = params
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [optionsArray, setOptionsArray] = useState<Option[][]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [success, setSuccess] = useState(false)

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
    return (
      <div className="flex justify-center pt-[49vh] w-full">
        <Oval color="#000000" height={50} width={50} />
      </div>
    )
  }

  const handleNextQuestion = (right: boolean) => {
    if (currentIndex + 2 > questions.length) {
      if (right) {
        setScore(score + 1)
        toast.success('Quiz completed!')
        setSuccess(true)
        confetti.onOpen()
      } else {
        toast.success('Quiz completed!')
        setSuccess(true)
        confetti.onOpen()
      }
    } else {
      if (right) {
        toast.success('Right')
        setScore(score + 1)
        setCurrentIndex(currentIndex + 1)
      } else {
        toast.error('Wrong')
        setCurrentIndex(currentIndex + 1)
      }
    }
  }

  if (!success) {
    return (
      <QuizView
        question={questions[currentIndex]}
        optionsArray={optionsArray[currentIndex]}
        onNextQuestion={handleNextQuestion}
        score={score}
      />
    )
  } else {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="text-center p-6 rounded-lg backdrop-blur-md bg-background/15 shadow-lg max-w-xl w-full">
          <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-4">
            Congratulations
          </h1>
          <Separator />
          <div className="mt-4">
            {score > 1 ? (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800">
                You got{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end text-6xl sm:text-7xl lg:text-8xl">
                  {score}
                </span>{' '}
                out of{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end text-6xl sm:text-7xl lg:text-8xl">
                  {questions.length}
                </span>{' '}
                questions right.
              </h1>
            ) : (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800">
                You got{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end text-6xl sm:text-7xl lg:text-8xl">
                  {score}
                </span>{' '}
                question right.
              </h1>
            )}
          </div>
          <div className="mt-6">
            <Link href="/discover">
              <Button className="px-4 py-2 text-white bg-accent rounded-lg">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
