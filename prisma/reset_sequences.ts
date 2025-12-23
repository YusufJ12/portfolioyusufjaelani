import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetSequences() {
  console.log('Resetting PostgreSQL sequences...')

  // Get max ID for each table and reset the sequence
  const tables = [
    { name: 'Admin', column: 'id' },
    { name: 'Profile', column: 'id' },
    { name: 'SocialLink', column: 'id' },
    { name: 'Skill', column: 'id' },
    { name: 'Experience', column: 'id' },
    { name: 'Education', column: 'id' },
    { name: 'Project', column: 'id' },
    { name: 'ContactMessage', column: 'id' },
  ]

  for (const table of tables) {
    try {
      // Reset the sequence to max(id) + 1
      await prisma.$executeRawUnsafe(`
        SELECT setval(pg_get_serial_sequence('"${table.name}"', '${table.column}'), 
        COALESCE((SELECT MAX("${table.column}") FROM "${table.name}"), 0) + 1, false);
      `)
      console.log(`✓ Reset sequence for ${table.name}`)
    } catch (error) {
      console.error(`✗ Error resetting ${table.name}:`, error)
    }
  }

  console.log('Done!')
  await prisma.$disconnect()
}

resetSequences()
