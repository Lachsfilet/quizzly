'use client'

import React from 'react'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { getAllQuizzes } from '@/actions/quiz'
import { Avatar } from '@mui/material'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { AtSign } from 'lucide-react'

import { Quiz } from '@/app/(root)/(routes)/discover/page'
import { useRouter } from 'next/navigation'

export function QuizCard({ quizzes }: { quizzes: Quiz[] }) {
  const { push } = useRouter()

  return (
    <div className="w-fit mx-auto pt-10">
      <ResponsiveMasonry
        className="flex w-full mx-auto justify-start"
        columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3 }}
      >
        <Masonry gutter="1.5rem" className="masonry-grid">
          {quizzes.map((quiz: Quiz) => (
            <button
              onClick={() => {
                push(`/quiz/${quiz?.id}`)
              }}
            >
              <CardContainer
                className="flex h-full cursor-default"
                key={quiz?.id}
              >
                <CardBody className="bg-[#131212] relative group/card border-slate-100/20 h-full rounded-xl px-6 py-4 border ">
                  <div className="flex justify-between">
                    <CardItem
                      translateZ="50"
                      className="text-base sm:text-xl font-bold text-slate-100 flex space-between items-center"
                    >
                      <div className="flex gap-2 items-center">
                        <Avatar src={quiz?.id} alt={`${quiz?.id}s Avatar`} />
                        <span className="flex gap-0.5 items-center">
                          <AtSign className="w-5 h-5 text-zinc-500" />
                          {quiz?.id}
                        </span>
                      </div>
                    </CardItem>
                  </div>

                  <CardItem className="font-medium pt-4 opacity-50">
                    <p>"{quiz?.id}"</p>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </button>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  )
}
