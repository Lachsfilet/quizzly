'use client'

import { useState, useEffect, useRef, useCallback, ChangeEvent, FormEvent } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion'
import { createQuiz } from '@/actions/quiz'
import { useCurrentUser } from '@/hooks/user-current-user'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Plus, Loader2 } from 'lucide-react'

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

const SUBMIT_COOLDOWN_MS = 2000

function CardForm({ className }: { className?: string }) {
  const router = useRouter()
  const user = useCurrentUser()
  const [quizTitle, setQuizTitle] = useState<string>('')
  const [quizDescription, setQuizDescription] = useState<string>('')
  const [dropdowns, setDropdowns] = useState<Dropdown[]>([
    { title: '', options: ['', '', '', ''], correctOption: null }
  ])
  const [toastShown, setToastShown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const lastSubmitTime = useRef<number>(0)

  useEffect(() => {
    if (!user && !toastShown) {
      toast.error('Please register to create a quiz!')
      setToastShown(true)
      router.push('/auth/register')
    }
  }, [user, toastShown, router])

  useEffect(() => {
    const savedQuiz = localStorage.getItem('savedQuiz')
    if (savedQuiz) {
      const { quizTitle, dropdowns } = JSON.parse(savedQuiz)
      setQuizTitle(quizTitle)
      setDropdowns(dropdowns)
      localStorage.removeItem('savedQuiz')
    }
  }, [])

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

  const handleQuizDescriptionChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setQuizDescription(event.target.value)
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

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault()

    if (isSubmitting) return

    const now = Date.now()
    if (now - lastSubmitTime.current < SUBMIT_COOLDOWN_MS) {
      toast.error('Please wait before submitting again.')
      return
    }

    setIsSubmitting(true)
    lastSubmitTime.current = now

    try {
      QuizSchema.parse({ quizTitle, quizDescription, dropdowns })

      const quiz = {
        title: quizTitle,
        description: `${quizDescription}`,
        userId: user?.id,
        questions: {
          create: dropdowns.map((dropdown) => ({
            title: dropdown.title,
            description: `${quizDescription}`,
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

      setQuizTitle('')
      setQuizDescription('')
      setDropdowns([
        { title: '', options: ['', '', '', ''], correctOption: null }
      ])
      localStorage.removeItem('savedQuiz')
    } catch (e: unknown) {
      if (e instanceof z.ZodError && e.errors.length > 0) {
        toast.error(e.errors[0].message)
      } else {
        toast.error('Failed to create quiz. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting, quizTitle, quizDescription, dropdowns, user?.id])

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(className, 'max-h-[75vh] overflow-auto p-4')}
    >
      <div className="mb-4">
        <label className="block mb-2 text-white">Quiz Title:</label>
        <Input
          type="text"
          value={quizTitle}
          onChange={handleQuizTitleChange}
          placeholder="Enter quiz title"
          className="mb-2"
          disabled={isSubmitting}
        />
        <label className="block mb-2 text-white">Quiz Description:</label>
        <Input
          type="text"
          value={quizDescription}
          onChange={handleQuizDescriptionChange}
          placeholder="Enter quiz description"
          className="mb-2"
          disabled={isSubmitting}
        />
      </div>

      <Accordion type="single" collapsible className="mb-4">
        {dropdowns.map((dropdown, index) => (
          <AccordionItem key={index} value={`question-${index}`}>
            <AccordionTrigger>Question {index + 1}</AccordionTrigger>
            <AccordionContent>
              <div className="mb-2">
                <label className="block mb-2 text-white">Question Title:</label>
                <Input
                  type="text"
                  value={dropdown.title}
                  onChange={(event) => handleDropdownTitleChange(index, event)}
                  placeholder="Enter question title"
                  className="mb-2"
                  disabled={isSubmitting}
                />
              </div>
              {dropdown.options.map((option, optionIndex) => (
                <div key={optionIndex} className="mb-2 flex items-center">
                  <label className="block mb-2 w-full text-white">
                    Option {optionIndex + 1}:
                    <Input
                      type="text"
                      value={option}
                      onChange={(event) =>
                        handleOptionChange(index, optionIndex, event)
                      }
                      placeholder={`Enter option ${optionIndex + 1}`}
                      className="ml-2 mb-2"
                      disabled={isSubmitting}
                    />
                  </label>
                  <input
                    type="radio"
                    name={`correctOption-${index}`}
                    checked={dropdown.correctOption === optionIndex}
                    onChange={() =>
                      handleCorrectOptionChange(index, optionIndex)
                    }
                    aria-label={`Mark option ${optionIndex + 1} as correct answer`}
                    disabled={isSubmitting}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                className="mb-2"
                onClick={() => handleRemoveDropdown(index)}
                disabled={isSubmitting}
              >
                Remove Question
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button type="button" onClick={handleAddDropdown} className="mr-2" disabled={isSubmitting}>
        Add Question
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit'
        )}
      </Button>
    </form>
  )
}

export function CreateQuiz() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <div className="max-h-50p overflow-scroll">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className={`bg-background fixed flex items-start justify-center bottom-6 right-6 rounded-full border border-border outline-none duration-200 z-50 p-2 transition-all`}
              aria-label="Create new quiz"
            >
              <div className="">
                <Plus className="h-10 w-10" />
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create quiz</DialogTitle>
              <DialogDescription>
                Create a quiz here. Click Submit when you're done.
              </DialogDescription>
            </DialogHeader>
            <CardForm className="" />
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button
            className={`bg-background fixed flex items-start justify-center bottom-6 right-6 rounded-full border border-border outline-none duration-200 z-50 p-2 transition-all`}
            aria-label="Create new quiz"
          >
            <div className="">
              <Plus className="h-10 w-10" />
            </div>
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Create quiz</DrawerTitle>
            <DrawerDescription>
              Create a quiz here. Click Submit when you're done.
            </DrawerDescription>
          </DrawerHeader>
          <CardForm className="max-h-[calc(100vh-150px)] overflow-auto" />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default CardForm
