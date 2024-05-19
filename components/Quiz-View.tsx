'use client'
import { useCurrentUser } from '@/hooks/user-current-user'
import Avatar from '@mui/material/Avatar'
import { Option } from '@/interfaces/option'
import { Button } from './ui/button'
import toast from 'react-hot-toast'
import { MouseEventHandler } from 'react'
import { useRouter } from 'next/navigation'
import { Question } from '@/interfaces/question'

interface QuizViewProps {
  question: Question
  optionsArray: Option[]
  questionIndex: number
}

export function QuizView({
  question,
  optionsArray,
  questionIndex
}: QuizViewProps) {
  const router = useRouter()
  const session = useCurrentUser()
  let score = 0

  function validateQuiz(right: boolean): MouseEventHandler<HTMLButtonElement> {
    return (event) => {
      if (!right) {
        toast.error('Not right')
      } else {
        toast.success('Right')
      }
    }
  }

  if (!session) {
    router.push('/auth/register')
    return null
  }

  return (
    <div className="w-full mt-20">
      <div className="w-full flex ml-5 h-auto">
        {!session.image ? (
          <h1 className="text-xl ml-2.5 self-center">{session.name}</h1>
        ) : (
          <>
            <Avatar
              src={session.image}
              alt="user image"
              className="rounded-full"
            />
            <h1 className="text-xl ml-2.5 self-center">{session.name}</h1>
            <h1 className="text-xl self-center">{score}</h1>
          </>
        )}
      </div>
      <div className="w-full">
        <div>
          <h1 className="text-5xl flex items-center justify-center backdrop-blur bg-accent/25">
            {question.title}
          </h1>
          {optionsArray.map((option: Option, i: number) => (
            <Button
              key={i}
              onClick={validateQuiz(option.isCorrect)}
              className="text-5xl"
            >
              {option.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
