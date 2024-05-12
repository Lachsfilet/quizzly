'use client'
import { createQuiz } from '@/actions/quiz'
import { useState } from 'react'
import { useCurrentUser } from '@/hooks/user-current-user'

export default function CreateQuiz() {
  const [amount, setAmount] = useState(1)
  const user = useCurrentUser()

  function increment() {
    setAmount(amount + 1)
    console.log(amount)
  }

  //create quiz according to the model
  const quiz = {
    title: `Quiz Title ${amount}`,
    description: `Quiz Description ${amount}`,
    userId: user?.id,
    questions: {
      create: [
        {
          title: `Question Title ${amount}`,
          description: `Question Description ${amount}`,
          options: {
            create: [
              {
                title: `Option Title ${amount}`,
                isCorrect: true
              }
              // More options...
            ]
          }
        }
        // More questions...
      ]
    }
  }

  function create() {
    // @ts-ignore
    createQuiz(quiz)
    increment()
  }
  if (!user) return null

  return (
    <div>
      <button onClick={create}>create quiz</button>
    </div>
  )
}
