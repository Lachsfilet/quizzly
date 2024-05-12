'use client'
import { Separator } from './ui/separator'
import Image from 'next/image'
import { AlertTriangle, Calendar, GitMerge, Rocket } from 'lucide-react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import PrimaryButton from './ui/get-started-button'

// change that and use it for myself later (maybe)

const features = [
  {
    icon: Rocket,
    name: 'Learn faster',
    description: 'Get the benefits of playful learning, without the stress'
  },
  {
    icon: AlertTriangle,
    name: 'Stay Focused',
    description:
      "Stay focused on what you need to learn and don't get bored with memorization"
  },
  {
    icon: Calendar,
    name: 'Daily Streaks',
    description:
      'Get daily streaks to keep you motivated and learn something new everyday'
  }
]

export const LandingPage: React.FC = () => {
  useEffect(() => {
    AOS.init({
      disable: 'phone',
      duration: 800,
      easing: 'ease-out-cubic'
    })
  }, [])
  return (
    <div className="landing pb-40 overflow-hidden">
      <div className=" px-4 mx-auto sm:px-6">
        <div>
          <div className="text-center pb-5 pt-40" data-aos="fade-up">
            <h1 className="font-bold text-6xl mx-6"> Quizzly</h1>
            <p className="text-md text-slate-100/40 pt-1">
              Learn something && have fun doing it.
            </p>
            <div className="flex items-center justify-center">
              <Separator className="mt-8 bg-slate-100/20 h-0.5 w-40" />
            </div>
          </div>
          <div className="text-center space-y-40 pt-12">
            <section>
              <div className="relative max-w-6xl px-4 mx-auto sm:px-6">
                <div>
                  <div>
                    {/* Section content */}
                    <div className="flex flex-col max-w-xl mx-auto md:max-w-none md:flex-row md:space-x-8 lg:space-x-16 xl:space-x-20 space-y-8 space-y-reverse md:space-y-0">
                      <div
                        className="order-1 md:w-7/12 lg:w-1/2 md:order-none max-md:text-center"
                        data-aos="fade-right"
                      >
                        <h3 className="pb-3 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-start  to-gradient-end">
                          Why use Quizzly?
                        </h3>
                        <p className="mb-8 text-lg text-zinc-400">
                          Quizzly is a platform that helps you learn faster and
                          more effectively. We provide you with the best tools
                          and resources to help you learn code and other
                          technical skills.
                        </p>
                        <dl className="max-w-xl grid grid-cols-1 gap-4 lg:max-w-none">
                          {features.map((feature) => (
                            <div
                              key={feature.name}
                              className="px-2 py-1 rounded group hover:bg-zinc-100/20  transition duration-500 cursor-pointer"
                            >
                              <div className="flex items-center mb-1 space-x-2 ">
                                <feature.icon className="w-4 h-4 shrink-0 text-zinc-300" />
                                <h4 className="font-medium text-zinc-50">
                                  {feature.name}
                                </h4>
                              </div>
                              <p className="text-sm text-left text-zinc-300">
                                {feature.description}
                              </p>
                            </div>
                          ))}
                        </dl>
                      </div>

                      <div className="flex max-w-2xl mx-auto mt-16 md:w-5/12 lg:w-1/2 sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
                        <div
                          className="z-10 flex-none max-w-3xl sm:max-w-5xl lg:max-w-none"
                          data-aos="fade-left"
                        >
                          <Image
                            src="/dribbble.png"
                            alt="App screenshot"
                            width={800}
                            height={600}
                            className="w-[76rem] z-10 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
