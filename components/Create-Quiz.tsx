// TODO: fix toast running twice, make form scrollable
'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { Label } from '@/components/ui/label'

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

function CardForm({ className }: { className: string }) {
  const router = useRouter()
  const user = useCurrentUser()
  const [quizTitle, setQuizTitle] = useState<string>('')
  const [quizDescription, setQuizDescription] = useState<string>('')
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      QuizSchema.parse({ quizTitle, quizDescription, dropdowns })

      const quiz = {
        title: quizTitle,
        description: `${quizDescription}`, // Replace with an actual description if needed
        userId: user?.id,
        questions: {
          create: dropdowns.map((dropdown) => ({
            title: dropdown.title,
            description: `${quizDescription}`, // Replace with an actual description if needed
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
    <form onSubmit={handleSubmit} className={cn(className)}>
      <div className="mb-4">
        <label className="block mb-2">Quiz Title:</label>
        <Input
          type="text"
          value={quizTitle}
          onChange={handleQuizTitleChange}
          placeholder="Enter quiz title"
        />
        <label className="block mb-2">Quiz Description:</label>
        <Input
          type="text"
          value={quizDescription}
          onChange={handleQuizDescriptionChange}
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
                  onChange={(event) => handleDropdownTitleChange(index, event)}
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
  )
}

export function CreateQuiz() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create quiz</Button>
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
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Create quiz</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create quiz</DrawerTitle>
          <DrawerDescription>
            Create a quiz here. Click Submit when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <CardForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CardForm
