import { getQuizById } from "@/actions/quiz";
import { db } from "@/lib/db";

export async function getUserByQuizId(quizId: string) {
    const quiz = await getQuizById(quizId)
    const userId = quiz?.userId

    const user = await db.user.findUnique({
        where: {
            id: userId
        }
    })

    return user
}