import { PrismaClient as SQLiteClient } from '@prisma/client'
import * as fs from 'fs'

async function exportData() {
  // We temporarily need to use a client that points to SQLite 
  // since the main schema is now set to postgresql
  const prisma = new SQLiteClient()

  const data = {
    admin: await prisma.admin.findMany(),
    profile: await prisma.profile.findMany(),
    socialLink: await prisma.socialLink.findMany(),
    skill: await prisma.skill.findMany(),
    experience: await prisma.experience.findMany(),
    education: await prisma.education.findMany(),
    project: await prisma.project.findMany(),
    contactMessage: await prisma.contactMessage.findMany(),
  }

  fs.writeFileSync('migration_data.json', JSON.stringify(data, null, 2))
  console.log('Data exported successfully to migration_data.json')
  
  await prisma.$disconnect()
}

exportData().catch(console.error)
