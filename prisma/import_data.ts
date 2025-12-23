import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

async function importData() {
  const prisma = new PrismaClient()
  
  if (!fs.existsSync('migration_data.json')) {
    console.error('Error: migration_data.json not found!')
    return
  }

  const rawData = fs.readFileSync('migration_data.json', 'utf8')
  const data = JSON.parse(rawData)

  console.log('Starting data import to PostgreSQL...')

  try {
    // 1. Admin
    if (data.admin.length > 0) {
      await prisma.admin.createMany({ data: data.admin, skipDuplicates: true })
      console.log('Imported Admin data')
    }

    // 2. Profile
    if (data.profile.length > 0) {
      await prisma.profile.createMany({ data: data.profile, skipDuplicates: true })
      console.log('Imported Profile data')
    }

    // 3. SocialLink
    if (data.socialLink.length > 0) {
      await prisma.socialLink.createMany({ data: data.socialLink, skipDuplicates: true })
      console.log('Imported SocialLink data')
    }

    // 4. Skill
    if (data.skill.length > 0) {
      await prisma.skill.createMany({ data: data.skill, skipDuplicates: true })
      console.log('Imported Skill data')
    }

    // 5. Experience
    if (data.experience.length > 0) {
      await prisma.experience.createMany({ data: data.experience, skipDuplicates: true })
      console.log('Imported Experience data')
    }

    // 6. Education
    if (data.education.length > 0) {
      await prisma.education.createMany({ data: data.education, skipDuplicates: true })
      console.log('Imported Education data')
    }

    // 7. Project
    if (data.project.length > 0) {
      await prisma.project.createMany({ data: data.project, skipDuplicates: true })
      console.log('Imported Project data')
    }

    // 8. ContactMessage
    if (data.contactMessage.length > 0) {
      await prisma.contactMessage.createMany({ data: data.contactMessage, skipDuplicates: true })
      console.log('Imported ContactMessage data')
    }

    console.log('All data imported successfully!')
  } catch (error) {
    console.error('Error during import:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importData()
