import { prisma } from '../src'

interface IListItem {
  id: string
  name: string
  cover: string
}

const run = async () => {
  const list = require('./list.local.json') as IListItem[]

  await prisma.list.createMany({
    data: list
  })

  await prisma.$disconnect()
}

run()
