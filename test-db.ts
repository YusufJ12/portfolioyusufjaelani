import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const results: any = {
    testTime: new Date().toISOString(),
    status: 'starting'
  }
  
  try {
    const experiences = await prisma.experience.findMany()
    results.experiencesCount = experiences.length
    if (experiences.length > 0) {
      results.firstExperience = experiences[0]
      results.firstExperienceAchievementsType = typeof experiences[0].achievements
    }
    
    const skills = await prisma.skill.findMany()
    results.skillsCount = skills.length
    if (skills.length > 0) {
      results.firstSkill = skills[0]
      results.firstSkillTechnologiesType = typeof skills[0].technologies
    }

    const projects = await prisma.project.findMany()
    results.projectsCount = projects.length
    if (projects.length > 0) {
      results.firstProject = projects[0]
      results.firstProjectTagsType = typeof projects[0].tags
    }
    
    results.status = 'success'
  } catch (err: any) {
    results.status = 'error'
    results.errorMessage = err.message
    results.errorStack = err.stack
  } finally {
    fs.writeFileSync('db-inspect-results.json', JSON.stringify(results, null, 2))
    await prisma.$disconnect()
    console.log('Results written to db-inspect-results.json')
  }
}

main()
