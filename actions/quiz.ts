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
  const unmappedQuizzes = await db.quiz.findMany()

  const quizzes = unmappedQuizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    userId: quiz.userId,
    createdAt: quiz.createdAt
  }))
  
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

// delete quiz by id

//    export const deleteQuiz = async (id: string) => {
//        const quiz = await db.quiz.delete({
//            where: { id: id }
//        });
//
//        return quiz;
//    }
