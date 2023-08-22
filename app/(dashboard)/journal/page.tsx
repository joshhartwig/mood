import { analyze } from '@/Utils/ai'
import { getUserByClerkId } from '@/Utils/auth'
import { prisma } from '@/Utils/db'
import EntryCard from '@/components/EntryCard'
import NewEntryCard from '@/components/NewEntry'
import Link from 'next/link'

const getEntries = async () => {
  const user = await getUserByClerkId()
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return entries
}

const Journal = async () => {
  const entries = await getEntries()
  console.log('entries:', entries)
  return (
    <div className="p-10 bg-zinc-400/10 h-full">
      <h2 className="text-3xl mb-8">Journal Entries</h2>
      <div className="grid grid-cols-3 gap-4">
        <NewEntryCard />
        {entries.map((entry) => (
          <Link href={`/journal/${entry.id}`} key={entry.id}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Journal
