'use client'
import { useCurrentUser } from '@/hooks/user-current-user'
import Avatar from '@mui/material/Avatar'
import { Option } from '@/interfaces/option'
import { Button } from './ui/button'
import toast from 'react-hot-toast'
import { MouseEventHandler } from 'react'
import { Question } from '@/interfaces/question'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

interface QuizViewProps {
  question: Question
  optionsArray: Option[]
  onNextQuestion: (isRight: boolean) => void
  score: number
}

export function QuizView({
  question,
  optionsArray,
  onNextQuestion,
  score
}: QuizViewProps) {
  const session = useCurrentUser()
  const router = useRouter()

  const validateQuiz = (
    right: boolean
  ): MouseEventHandler<HTMLButtonElement> => {
    return () => {
      onNextQuestion(right)
    }
  }

  return (
    <div className="w-full mt-20">
      <div className="w-full flex justify-between items-center ml-5 mr-16 h-auto">
        <div className="flex items-center">
          <Avatar
            src={session?.image ? session?.image : ''}
            alt={`${session?.name || 'User'} profile`}
            className="mr-5 shadow-md shadow-black hover:scale-110 transition-transform duration-300  bg-gradient-to-r from-gradient-start to-gradient-end"
            sx={{ width: 40, height: 40 }}
          ></Avatar>
          <h1 className="text-xl">{!session ? 'Anonymous' : session?.name}</h1>
        </div>
        <Badge variant={'secondary'} className="w-20 h-10 mr-10 text-center">
          <h2 className="text-xl">{score}</h2>
        </Badge>
      </div>
      <div className="w-full mt-8">
        <h1 className="text-5xl flex items-center justify-center backdrop-blur bg-accent/25">
          {question.title}
        </h1>
        <div className="mt-8 flex flex-col items-center">
          {optionsArray.map((option: Option, i: number) => (
            <Button
              key={i}
              onClick={validateQuiz(option.isCorrect)}
              className="text-2xl mb-4"
            >
              {option.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
