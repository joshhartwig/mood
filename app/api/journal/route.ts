import { analyze } from '@/Utils/ai'
import { getUserByClerkId } from '@/Utils/auth'
import { prisma } from '@/Utils/db'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const POST = async () => {
  const user = await getUserByClerkId()
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: 'write about your day!',
    },
  })

  const analysis = await analyze(entry.content)
  await prisma.analysis.create({
    data: {
      entryId: entry.id,
      ...analysis,
    },
  })

  revalidatePath('/journal')
  return NextResponse.json({
    data: entry,
  })
}
