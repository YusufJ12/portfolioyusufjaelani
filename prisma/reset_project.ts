import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetProjectTable() {
  console.log('Resetting Project table...')

  try {
    // Delete all projects
    await prisma.project.deleteMany({})
    console.log('✓ Deleted all projects')

    // Now reset sequence - this should work after table is empty
    await prisma.$executeRaw`ALTER SEQUENCE "Project_id_seq" RESTART WITH 1`
    console.log('✓ Reset Project sequence to 1')

  } catch (error) {
    console.error('Error:', error)
  }

  await prisma.$disconnect()
}

resetProjectTable()
