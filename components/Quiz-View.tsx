'use client'

import { useCurrentUser } from '@/hooks/user-current-user'
import Avatar from '@mui/material/Avatar'
import { QuizViewProps } from '@/interfaces/option'
import { Button } from './ui/button'
import toast from 'react-hot-toast'
import { MouseEventHandler } from 'react'

export function QuizView({ questions, optionsArray }: QuizViewProps) {
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
    return <h1>Login pls</h1>
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
        {questions.map((q: any, index: number) => (
          <div key={index}>
            <h1 className="text-5xl flex items-center justify-center backdrop-blur bg-accent/25">
              {q.title}
            </h1>
            {optionsArray[index].map((o: any, i: number) => (
              <Button
                key={i}
                onClick={validateQuiz(o.isCorrect)}
                className="text-5xl"
              >
                {o.title}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
