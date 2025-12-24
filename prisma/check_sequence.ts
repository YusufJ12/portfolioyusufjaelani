import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkSequence() {
  console.log('Checking Project table...')

  // Get max ID
  const maxResult = await prisma.$queryRaw`SELECT MAX(id) as max_id FROM "Project"`
  console.log('Max ID in Project:', maxResult)

  // Get current sequence value
  const seqResult = await prisma.$queryRaw`SELECT last_value FROM "Project_id_seq"`
  console.log('Current sequence value:', seqResult)

  // Get all projects
  const projects = await prisma.project.findMany({ select: { id: true, title: true } })
  console.log('All projects:', projects)

  await prisma.$disconnect()
}

checkSequence().catch(console.error)
