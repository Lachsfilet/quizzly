// TODO: fix toast running twice
'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion'
import { Separator } from './ui/separator'
import { createQuiz } from '@/actions/quiz'
import { useCurrentUser } from '@/hooks/user-current-user'

interface Dropdown {
  title: string
  options: string[]
  correctOption: number | null
}

const QuizSchema = z.object({
  quizTitle: z.string().nonempty('Quiz title cannot be empty'),
  dropdowns: z
    .array(
      z.object({
        title: z.string().nonempty('Question title cannot be empty'),
        options: z
          .array(z.string().nonempty('Option cannot be empty'))
          .length(4),
        correctOption: z
          .number()
          .int()
          .nullable()
          .refine((val) => val !== null, {
            message: 'A correct option must be selected'
          })
      })
    )
    .nonempty('At least one question must be added')
})

const CardForm: React.FC = () => {
  const router = useRouter()
  const user = useCurrentUser()
  const [quizTitle, setQuizTitle] = useState<string>('')
  const [dropdowns, setDropdowns] = useState<Dropdown[]>([
    { title: '', options: ['', '', '', ''], correctOption: null }
  ])

  if (!user) {
    toast.error('Please register to create a quiz!')
    router.push('/auth/register')
    return
  }

  useEffect(() => {
    const savedQuiz = localStorage.getItem('savedQuiz')
    if (savedQuiz) {
      const { quizTitle, dropdowns } = JSON.parse(savedQuiz)
      setQuizTitle(quizTitle)
      setDropdowns(dropdowns)
      localStorage.removeItem('savedQuiz')
    }
  }, [router])

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(
        'savedQuiz',
        JSON.stringify({ quizTitle, dropdowns })
      )
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [quizTitle, dropdowns])

  const handleQuizTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuizTitle(event.target.value)
  }

  const handleDropdownTitleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newDropdowns = dropdowns.map((dropdown, i) =>
      i === index ? { ...dropdown, title: event.target.value } : dropdown
    )
    setDropdowns(newDropdowns)
  }

  const handleOptionChange = (
    dropdownIndex: number,
    optionIndex: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newDropdowns = dropdowns.map((dropdown, i) =>
      i === dropdownIndex
        ? {
            ...dropdown,
            options: dropdown.options.map((option, j) =>
              j === optionIndex ? event.target.value : option
            )
          }
        : dropdown
    )
    setDropdowns(newDropdowns)
  }

  const handleCorrectOptionChange = (
    dropdownIndex: number,
    optionIndex: number
  ) => {
    const newDropdowns = dropdowns.map((dropdown, i) =>
      i === dropdownIndex
        ? { ...dropdown, correctOption: optionIndex }
        : dropdown
    )
    setDropdowns(newDropdowns)
  }

  const handleAddDropdown = () => {
    setDropdowns([
      ...dropdowns,
      { title: '', options: ['', '', '', ''], correctOption: null }
    ])
  }

  const handleRemoveDropdown = (index: number) => {
    setDropdowns(dropdowns.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      QuizSchema.parse({ quizTitle, dropdowns })

      const quiz = {
        title: quizTitle,
        description: `Description for ${quizTitle}`, // Replace with an actual description if needed
        userId: user?.id,
        questions: {
          create: dropdowns.map((dropdown) => ({
            title: dropdown.title,
            description: `Description for ${dropdown.title}`, // Replace with an actual description if needed
            options: {
              create: dropdown.options.map((option, optionIndex) => ({
                title: option,
                isCorrect: dropdown.correctOption === optionIndex
              }))
            }
          }))
        }
      }

      await createQuiz(quiz)
      toast.success('Quiz submitted successfully!')
      console.log('Quiz data:', { quizTitle, dropdowns })

      // Reset the form
      setQuizTitle('')
      setDropdowns([
        { title: '', options: ['', '', '', ''], correctOption: null }
      ])
      localStorage.removeItem('savedQuiz')
    } catch (e: any) {
      if (e.errors && e.errors.length > 0) {
        toast.error(e.errors[0].message)
      }
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <CardHeader>
        <CardTitle className="flex justify-center text-xxl">
          Quiz Form
        </CardTitle>
      </CardHeader>
      <Separator className="my-4 bg-slate-300/20" />
      <CardContent className="mt-2">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Quiz Title:</label>
            <Input
              type="text"
              value={quizTitle}
              onChange={handleQuizTitleChange}
              placeholder="Enter quiz title"
            />
          </div>

          <Accordion type="single" collapsible className="mb-4">
            {dropdowns.map((dropdown, index) => (
              <AccordionItem key={index} value={`question-${index}`}>
                <AccordionTrigger>Question {index + 1}</AccordionTrigger>
                <AccordionContent>
                  <div className="mb-2">
                    <label className="block mb-2">Question Title:</label>
                    <Input
                      type="text"
                      value={dropdown.title}
                      onChange={(event) =>
                        handleDropdownTitleChange(index, event)
                      }
                      placeholder="Enter question title"
                    />
                  </div>
                  {dropdown.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="mb-2 flex items-center">
                      <label className="block mb-2 w-full">
                        Option {optionIndex + 1}:
                        <Input
                          type="text"
                          value={option}
                          onChange={(event) =>
                            handleOptionChange(index, optionIndex, event)
                          }
                          placeholder={`Enter option ${optionIndex + 1}`}
                          className="ml-2"
                        />
                      </label>
                      <input
                        type="radio"
                        name={`correctOption-${index}`}
                        checked={dropdown.correctOption === optionIndex}
                        onChange={() =>
                          handleCorrectOptionChange(index, optionIndex)
                        }
                      />
                    </div>
                  ))}{' '}
                  '
                  <Button
                    variant="outline"
                    className="mb-2"
                    onClick={() => handleRemoveDropdown(index)}
                  >
                    Remove Question
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button type="button" onClick={handleAddDropdown} className="mr-2">
            Add Question
          </Button>
          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CardForm
