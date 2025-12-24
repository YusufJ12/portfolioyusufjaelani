import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function forceResetSequence() {
  console.log('Force resetting Project sequence to 100...')

  try {
    // Force sequence to a high value
    await prisma.$executeRaw`ALTER SEQUENCE "Project_id_seq" RESTART WITH 100`
    console.log('✓ Project sequence set to 100')

    // Also reset other sequences to be safe
    await prisma.$executeRaw`ALTER SEQUENCE "Admin_id_seq" RESTART WITH 100`
    await prisma.$executeRaw`ALTER SEQUENCE "Profile_id_seq" RESTART WITH 100`
    await prisma.$executeRaw`ALTER SEQUENCE "Skill_id_seq" RESTART WITH 100`
    await prisma.$executeRaw`ALTER SEQUENCE "Experience_id_seq" RESTART WITH 100`
    await prisma.$executeRaw`ALTER SEQUENCE "Education_id_seq" RESTART WITH 100`
    await prisma.$executeRaw`ALTER SEQUENCE "SocialLink_id_seq" RESTART WITH 100`
    await prisma.$executeRaw`ALTER SEQUENCE "ContactMessage_id_seq" RESTART WITH 100`
    console.log('✓ All sequences reset to 100')

  } catch (error) {
    console.error('Error:', error)
  }

  await prisma.$disconnect()
}

forceResetSequence()
