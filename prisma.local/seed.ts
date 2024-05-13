import { PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()
import { PasswordManager } from '../src/utils';
import { datePlusXDay } from '../src/utils/common';
import { foodNamesList } from './foodName';

// // sample = function(){
//   return this[Math.floor(Math.random()*this.length)];
// }

const sample = (arrayOfObject: any[]) => {
  return arrayOfObject[Math.floor(Math.random() * arrayOfObject.length)];
}

const twoSample = (li1: any[], li2: any[]) => {
  return sample(li1) + "_" + sample(li2)
}

const randNums = () => {
  return Math.floor(Math.random() * 100);
}

const randNumsBetween = (from: number, until: number) => {
  return Math.floor(Math.random() * (until - from) + from );
}

const randNumBetwen1_5 = () => {
  return Math.floor(Math.random() * 4 + 1)
}

async function usr() {
  let userData = {
    email: 'dummy@chdiary.io',
    nickname: 'dummy',
  }
  let userDataPw = {
    ...userData,
    password: await (new PasswordManager()).toHash('1234')
  }
  const user = await prisma.user.upsert({
    // where: { email: 'dummy@chdiary.io' },
    where: {
      nickname: 'dummy',
    },
    update: {
      ...userDataPw
    },
    create: {
      ...userDataPw
    },
  })
  return user
}

// async function food(user: User) {
async function food(_user: Promise<User>, count: number = 1) {
  let user = await _user
  for (let index = 0; index < count; index++) {
    for (let i = 0; i < randNumBetwen1_5(); i++) {
      const foodProp = await prisma.foodProperty.create({
        data: {
          // ch: 40 + randNumsBetween(0, 60),
          ch: randNumsBetween(12.4, 20.5),
          energy: randNums(),
          fat: randNums(),
          gramm: 100,
          protein: randNums(),
        },
      })
      // _.sample(['January', 'February', 'March']);
      let interFType = { name: sample(["DKM", "D7", "D1", "RK2"]) as string }
      const interfoodType = await prisma.interfoodType.upsert({
        where: {
          name: interFType.name
        },
        update: {
          ...interFType
        },
        create: {
          ...interFType
        },
      })
      const interfood = await prisma.interfood.create({
        data: {
          interfoodTypeId: interfoodType.id
        },
      })
      const food = await prisma.food.create({
        data: {
          name: sample(foodNamesList),
          // portion: randNums(),
          portion: interFType.name === "DKM" ? 600 : 450,
          foodPropertyId: foodProp.id,
          interfoodId: interfood.id,

        },
      })
      await prisma.chDiary.create({
        data: {
          userId: user.id,
          foodId: food.id,
          createdAt: datePlusXDay(index)
        },
      })
    }
  }
}

// u = await usr()

food(usr(), 10)
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
