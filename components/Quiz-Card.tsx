'use client'

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import Link from 'next/link'

import { QuizWithUserInfo } from '@/app/(root)/(routes)/discover/page'
import { useRouter } from 'next/navigation'
import { Avatar } from '@mui/material'

export function QuizCard({ quizzes }: { quizzes: QuizWithUserInfo[] }) {
  const { push } = useRouter()

  if (quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-xl text-slate-100/40">No quizzes found</p>
        <p className="text-sm text-slate-100/30 mt-2">
          Be the first to create one!
        </p>
      </div>
    )
  }

  return (
    <div className="w-fit mx-auto pt-10">
      <ResponsiveMasonry
        className="flex w-full mx-auto justify-start"
        columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3 }}
      >
        <Masonry gutter="1.5rem" className="masonry-grid">
          {quizzes.map((quiz: QuizWithUserInfo) => (
            <button
              key={quiz.id}
              onClick={() => {
                push(`/quiz/${quiz.id}`)
              }}
            >
              <CardContainer
                className="flex h-full cursor-default"
              >
                <CardBody className="relative group/card backdrop-blur-md bg-background/15 shadow-lg rounded-xl h-full px-6 py-4">
                  <div className="flex justify-between">
                    <CardItem
                      translateZ="50"
                      className="text-base sm:text-xl font-bold text-slate-100 flex space-between items-center"
                    >
                      <div className="flex gap-2 items-center">
                        <span className="flex gap-0.5 items-center">
                          {quiz?.title}{' '}
            
                          <p className="text-sm opacity-25 mr-5 hover:opacity-30 pl-2">
                            <button>
                              <Link href={`/user/${quiz.userId}`}>by {quiz.user.name}</Link>
                            </button>
                            
                          </p>
                        </span>
                      </div>
                    </CardItem>
                  </div>

                  <CardItem className="font-medium pt-4 opacity-80">
                    <p>{quiz.description}</p>
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
