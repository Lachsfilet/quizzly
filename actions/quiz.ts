'use server'

import { db } from '@/lib/db'
import { Quiz } from '@prisma/client'

export const createQuiz = async (data: any) => {
  const quiz = await db.quiz.create({
    data: data
  })
  console.log(quiz)
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

// delete quiz by id

//    export const deleteQuiz = async (id: string) => {
//        const quiz = await db.quiz.delete({
//            where: { id: id }
//        });
//
//        return quiz;
//    }
