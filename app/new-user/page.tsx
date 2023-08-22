import { prisma } from "@/Utils/db"
import { auth, currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const createUser = async () => {
  const user = await currentUser()

  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id as string
    }
  })

  if(!match) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
      },
    })
  }

  redirect('/journal')
}

const NewUser = async () => {
  await createUser()
  return (
    <div>...loading</div>
  )
}

export default NewUser