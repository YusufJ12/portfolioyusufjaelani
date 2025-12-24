import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetSequences() {
  console.log('Resetting PostgreSQL sequences...')

  try {
    // Reset Project sequence
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Project"', 'id'), COALESCE((SELECT MAX(id) FROM "Project"), 0) + 1, false)`
    console.log('✓ Reset Project sequence')

    // Reset Admin sequence
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Admin"', 'id'), COALESCE((SELECT MAX(id) FROM "Admin"), 0) + 1, false)`
    console.log('✓ Reset Admin sequence')

    // Reset Profile sequence
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Profile"', 'id'), COALESCE((SELECT MAX(id) FROM "Profile"), 0) + 1, false)`
    console.log('✓ Reset Profile sequence')

    // Reset Skill sequence
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Skill"', 'id'), COALESCE((SELECT MAX(id) FROM "Skill"), 0) + 1, false)`
    console.log('✓ Reset Skill sequence')

    // Reset Experience sequence
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Experience"', 'id'), COALESCE((SELECT MAX(id) FROM "Experience"), 0) + 1, false)`
    console.log('✓ Reset Experience sequence')

    // Reset Education sequence
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Education"', 'id'), COALESCE((SELECT MAX(id) FROM "Education"), 0) + 1, false)`
    console.log('✓ Reset Education sequence')

    // Reset SocialLink sequence
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"SocialLink"', 'id'), COALESCE((SELECT MAX(id) FROM "SocialLink"), 0) + 1, false)`
    console.log('✓ Reset SocialLink sequence')

    // Reset ContactMessage sequence
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"ContactMessage"', 'id'), COALESCE((SELECT MAX(id) FROM "ContactMessage"), 0) + 1, false)`
    console.log('✓ Reset ContactMessage sequence')

  } catch (error) {
    console.error('Error:', error)
  }

  console.log('Done!')
  await prisma.$disconnect()
}

resetSequences()
