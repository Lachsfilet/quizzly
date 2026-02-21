'use server'

import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { auth } from '@/auth'
import { rateLimit } from '@/lib/rate-limit'

export const createQuiz = async (data: Prisma.QuizCreateInput) => {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('You must be logged in to create a quiz.')
  }

  const { success } = rateLimit(`create-quiz:${session.user.id}`)
  if (!success) {
    throw new Error('Too many requests. Please wait before creating another quiz.')
  }

  const quiz = await db.quiz.create({
    data: data
  })
  return quiz
}

// get all quizzes

export const getAllQuizzes = async () => {
  const quizzes = await db.quiz.findMany()
  
  return quizzes
}

// get quiz by id

export const getQuizById = async (id: string) => {
  const quiz = await db.quiz.findUnique({
    where: { id: id }
  })

  return quiz
}

// get all quizzes by user id

export const getQuizzesByUserId = async (userId: string) => {
  const quizzes = await db.quiz.findMany({
    where: { userId: userId }
  })

  return quizzes
}

// get questions by quizId 

export const getQuestionsByQuizId = async (quizId: string) => {
  const unmappedQuestions = await db.question.findMany({
    where: {
      quizId: quizId
    }
  })

  return [...unmappedQuestions]
}

export const getOptionsByQuestionId = async (questionId: string) => {
  const unmappedOptions = await db.option.findMany({
    where: {
      questionId: questionId
    }
  })

  return [...unmappedOptions]
}
