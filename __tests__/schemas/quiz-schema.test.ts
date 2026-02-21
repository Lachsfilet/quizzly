import { z } from 'zod'

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

describe('QuizSchema validation', () => {
  const validQuiz = {
    quizTitle: 'My Quiz',
    dropdowns: [
      {
        title: 'Question 1',
        options: ['A', 'B', 'C', 'D'],
        correctOption: 0
      }
    ]
  }

  it('accepts a valid quiz', () => {
    const result = QuizSchema.safeParse(validQuiz)
    expect(result.success).toBe(true)
  })

  it('rejects empty quiz title', () => {
    const result = QuizSchema.safeParse({
      ...validQuiz,
      quizTitle: ''
    })
    expect(result.success).toBe(false)
  })

  it('rejects quiz with no questions', () => {
    const result = QuizSchema.safeParse({
      ...validQuiz,
      dropdowns: []
    })
    expect(result.success).toBe(false)
  })

  it('rejects question with empty title', () => {
    const result = QuizSchema.safeParse({
      ...validQuiz,
      dropdowns: [
        {
          title: '',
          options: ['A', 'B', 'C', 'D'],
          correctOption: 0
        }
      ]
    })
    expect(result.success).toBe(false)
  })

  it('rejects question with less than 4 options', () => {
    const result = QuizSchema.safeParse({
      ...validQuiz,
      dropdowns: [
        {
          title: 'Q1',
          options: ['A', 'B', 'C'],
          correctOption: 0
        }
      ]
    })
    expect(result.success).toBe(false)
  })

  it('rejects question with more than 4 options', () => {
    const result = QuizSchema.safeParse({
      ...validQuiz,
      dropdowns: [
        {
          title: 'Q1',
          options: ['A', 'B', 'C', 'D', 'E'],
          correctOption: 0
        }
      ]
    })
    expect(result.success).toBe(false)
  })

  it('rejects question with empty option', () => {
    const result = QuizSchema.safeParse({
      ...validQuiz,
      dropdowns: [
        {
          title: 'Q1',
          options: ['A', '', 'C', 'D'],
          correctOption: 0
        }
      ]
    })
    expect(result.success).toBe(false)
  })

  it('rejects question without correct option selected', () => {
    const result = QuizSchema.safeParse({
      ...validQuiz,
      dropdowns: [
        {
          title: 'Q1',
          options: ['A', 'B', 'C', 'D'],
          correctOption: null
        }
      ]
    })
    expect(result.success).toBe(false)
  })

  it('accepts quiz with multiple questions', () => {
    const result = QuizSchema.safeParse({
      quizTitle: 'Multi-question Quiz',
      dropdowns: [
        {
          title: 'Question 1',
          options: ['A', 'B', 'C', 'D'],
          correctOption: 0
        },
        {
          title: 'Question 2',
          options: ['W', 'X', 'Y', 'Z'],
          correctOption: 3
        },
        {
          title: 'Question 3',
          options: ['1', '2', '3', '4'],
          correctOption: 1
        }
      ]
    })
    expect(result.success).toBe(true)
  })

  it('accepts correct option at each valid index (0-3)', () => {
    for (let i = 0; i < 4; i++) {
      const result = QuizSchema.safeParse({
        ...validQuiz,
        dropdowns: [
          {
            title: 'Q1',
            options: ['A', 'B', 'C', 'D'],
            correctOption: i
          }
        ]
      })
      expect(result.success).toBe(true)
    }
  })

  it('stress test: validates quiz with 50 questions', () => {
    const manyQuestions = Array.from({ length: 50 }, (_, i) => ({
      title: `Question ${i + 1}`,
      options: [`Opt ${i}A`, `Opt ${i}B`, `Opt ${i}C`, `Opt ${i}D`],
      correctOption: i % 4
    }))

    const result = QuizSchema.safeParse({
      quizTitle: 'Massive Quiz',
      dropdowns: manyQuestions
    })
    expect(result.success).toBe(true)
  })

  it('stress test: validates 100 quizzes rapidly', () => {
    const results: boolean[] = []
    for (let q = 0; q < 100; q++) {
      const result = QuizSchema.safeParse({
        quizTitle: `Quiz ${q}`,
        dropdowns: [
          {
            title: `Q${q}`,
            options: ['A', 'B', 'C', 'D'],
            correctOption: q % 4
          }
        ]
      })
      results.push(result.success)
    }
    expect(results.every(Boolean)).toBe(true)
  })

  it('accepts whitespace-only quiz title (nonempty does not trim)', () => {
    const result = QuizSchema.safeParse({
      ...validQuiz,
      quizTitle: '   '
    })
    expect(result.success).toBe(true)
  })

  it('accepts very long quiz title', () => {
    const result = QuizSchema.safeParse({
      ...validQuiz,
      quizTitle: 'a'.repeat(1000)
    })
    expect(result.success).toBe(true)
  })

  it('accepts very long option text', () => {
    const result = QuizSchema.safeParse({
      ...validQuiz,
      dropdowns: [
        {
          title: 'Q1',
          options: ['a'.repeat(500), 'b'.repeat(500), 'c'.repeat(500), 'd'.repeat(500)],
          correctOption: 0
        }
      ]
    })
    expect(result.success).toBe(true)
  })

  it('rejects non-integer correctOption', () => {
    const result = QuizSchema.safeParse({
      ...validQuiz,
      dropdowns: [
        {
          title: 'Q1',
          options: ['A', 'B', 'C', 'D'],
          correctOption: 1.5
        }
      ]
    })
    expect(result.success).toBe(false)
  })
})
