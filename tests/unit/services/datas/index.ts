
const expectedSuccessInterFoodImports = [
  {
    userId: '123456789',
    foodName: 'Csirkemell Holstein módra, zöldségekkel, rizzsel',
    foodPortion: 200,
    createdAt: new Date('2022-05-16T12:00:00.000Z'),
    interFoodType: 'D9',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Csirkemell sajtos bundában, zöldséges barnarizs',
    foodPortion: 200,
    createdAt: new Date('2022-05-17T12:00:00.000Z'),
    interFoodType: 'D7',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Bakonyi sertésszelet, tészta köret',
    foodPortion: 200,
    createdAt: new Date('2022-05-18T12:00:00.000Z'),
    interFoodType: 'D13',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Thai zöldséges csirkés tészta',
    foodPortion: 200,
    createdAt: new Date('2022-05-19T12:00:00.000Z'),
    interFoodType: 'D6',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Mátrai borzas csirkemell, rizses zöldség',
    foodPortion: 200,
    createdAt: new Date('2022-05-20T12:00:00.000Z'),
    interFoodType: 'D7',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma)',
    foodPortion: 200,
    createdAt: new Date('2022-05-21T12:00:00.000Z'),
    interFoodType: 'D7',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  }
]

const expectedSuccessInterFoodImportsFoodMissingInMiddleWeek = [
  {
    "createdAt": "2022-05-16T12:00:00.000Z",
    "foodName": "Csirkemell Holstein módra, zöldségekkel, rizzsel",
    "foodPortion": 200,
    "foodProp": {
      "ch": 24.8,
      "fat": 5.11,
      "gramm": 100,
      "energy": 203.78,
      "protein": 13.16
    },
    "interFoodType": "D9",
    "userId": "123456789"
  },
  {
    "createdAt": "2022-05-17T12:00:00.000Z",
    "foodName": "Csirkemell sajtos bundában, zöldséges barnarizs",
    "foodPortion": 200,
    "foodProp": {
      "ch": 24.8,
      "fat": 5.11,
      "gramm": 100,
      "energy": 203.78,
      "protein": 13.16
    },
    "interFoodType": "D7",
    "userId": "123456789"
  },
  {
    "createdAt": "2022-05-19T12:00:00.000Z",
    "foodName": "Thai zöldséges csirkés tészta",
    "foodPortion": 200,
    "foodProp": {
      "ch": 24.8,
      "fat": 5.11,
      "gramm": 100,
      "energy": 203.78,
      "protein": 13.16
    },
    "interFoodType": "D6",
    "userId": "123456789"
  },
  {
    "createdAt": "2022-05-20T12:00:00.000Z",
    "foodName": "Bakonyi sertésszelet, tészta köret",
    "foodPortion": 200,
    "foodProp": {
      "ch": 24.8,
      "fat": 5.11,
      "gramm": 100,
      "energy": 203.78,
      "protein": 13.16
    },
    "interFoodType": "D13",
    "userId": "123456789"
  },
  {
    "createdAt": "2022-05-21T12:00:00.000Z",
    "foodName": "Mátrai borzas csirkemell, rizses zöldség",
    "foodPortion": 200,
    "foodProp": {
      "ch": 24.8,
      "fat": 5.11,
      "gramm": 100,
      "energy": 203.78,
      "protein": 13.16
    },
    "interFoodType": "D7",
    "userId": "123456789"
  },
  {
    "createdAt": "2022-05-22T12:00:00.000Z",
    "foodName": "Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma)",
    "foodPortion": 200,
    "foodProp": {
      "ch": 24.8,
      "fat": 5.11,
      "gramm": 100,
      "energy": 203.78,
      "protein": 13.16
    },
    "interFoodType": "D7",
    "userId": "123456789"
  }
]

const expectedSuccessInterFoodImportsSameDay = [
  {
    userId: '123456789',
    foodName: 'Thai zöldséges csirkés tészta',
    foodPortion: 200,
    createdAt: '2022-05-16T12:00:00.000Z',
    interFoodType: 'D6',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma)',
    foodPortion: 200,
    createdAt: '2022-05-17T12:00:00.000Z',
    interFoodType: 'D7',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Csirkemell sajtos bundában, zöldséges barnarizs',
    foodPortion: 200,
    createdAt: '2022-05-18T12:00:00.000Z',
    interFoodType: 'D7',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Mátrai borzas csirkemell, rizses zöldség',
    foodPortion: 200,
    createdAt: '2022-05-19T12:00:00.000Z',
    interFoodType: 'D7',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Csirkemell Holstein módra, zöldségekkel, rizzsel',
    foodPortion: 200,
    createdAt: '2022-05-20T12:00:00.000Z',
    interFoodType: 'D9',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Bakonyi sertésszelet, tészta köret',
    foodPortion: 200,
    createdAt: '2022-05-21T12:00:00.000Z',
    interFoodType: 'D13',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  }
]

const expectedSuccessBuggedVal = [
  {
    userId: '123456789',
    foodName: 'Thai pirított marha csíkok, tojásos barnarizs',
    foodPortion: 200,
    createdAt: '2022-05-23T12:00:00.000Z',
    interFoodType: 'D10',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Bangkoki marha (távol-keleti szósz, tészta, marhahús)',
    foodPortion: 200,
    createdAt: '2022-05-24T12:00:00.000Z',
    interFoodType: 'D6',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Roston csirkemell, négysajtmártás, párolt karotta borsóval, kukoricával',
    foodPortion: 200,
    createdAt: '2022-05-25T12:00:00.000Z',
    interFoodType: 'D9',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Vadas marhatokány (light) spagetti',
    foodPortion: 200,
    createdAt: '2022-05-26T12:00:00.000Z',
    interFoodType: 'D10',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Brokkolival töltött csirke, zöldségekkel',
    foodPortion: 200,
    createdAt: '2022-05-27T12:00:00.000Z',
    interFoodType: 'D9',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Rántott fűszeres csirkecomb, amerikai káposztasaláta',
    foodPortion: 200,
    createdAt: '2022-05-28T12:00:00.000Z',
    interFoodType: 'D7',
    foodProp: { gramm: 100, energy: 203.78, fat: 5.11, ch: 24.8, protein: 13.16 }
  }
]

const expectedSoupWithSecondCourse = [
  {
    "createdAt": "2023-03-27T12:00:00.000Z",
    "foodName": "Tavaszi zöldborsóleves, Sokmagvas rántott pulykamell, párolt burgonyával, zöldségekkel",
    "foodPortion": 600,
    "foodProp": {
      "ch": 7.65,
      "energy": 97,
      "fat": 4.1,
      "gramm": 100,
      "protein": 6.45
    },
    "interFoodType": "DKM",
    "userId": "123456789"
  },
  {
    "createdAt": "2023-03-28T12:00:00.000Z",
    "foodName": "Póréhagymás sárgarépás gombaleves, Roston csirkemell, négysajtmártás, párolt karotta borsóval, kukoricával",
    "foodPortion": 600,
    "foodProp": {
      "ch": 7.65,
      "energy": 97,
      "fat": 4.1,
      "gramm": 100,
      "protein": 6.45
    },
    "interFoodType": "DKM",
    "userId": "123456789"
  },
  {
    "createdAt": "2023-03-29T12:00:00.000Z",
    "foodName": "Májgaluska leves gazdagon zöldségekkel, Rántott gomba, burgonyapüré (light)",
    "foodPortion": 600,
    "foodProp": {
      "ch": 7.65,
      "energy": 97,
      "fat": 4.1,
      "gramm": 100,
      "protein": 6.45
    },
    "interFoodType": "DKM",
    "userId": "123456789"
  },
  {
    "createdAt": "2023-03-30T12:00:00.000Z",
    "foodName": "Újházy tyúkhúsleves, Bácskai csirkés bulgur",
    "foodPortion": 600,
    "foodProp": {
      "ch": 7.65,
      "energy": 97,
      "fat": 4.1,
      "gramm": 100,
      "protein": 6.45
    },
    "interFoodType": "DKM",
    "userId": "123456789"
  },
  {
    "createdAt": "2023-03-31T12:00:00.000Z",
    "foodName": "Tejszínes feketeszeder leves, Borjúpaprikás bulgurral",
    "foodPortion": 600,
    "foodProp": {
      "ch": 7.65,
      "energy": 97,
      "fat": 4.1,
      "gramm": 100,
      "protein": 6.45
    },
    "interFoodType": "DKM",
    "userId": "123456789"
  },
  {
    "createdAt": "2023-04-01T12:00:00.000Z",
    "foodName": "Rántott fűszeres csirkecomb, amerikai káposztasaláta",
    "foodPortion": 600,
    "foodProp": {
      "ch": 7.65,
      "energy": 97,
      "fat": 4.1,
      "gramm": 100,
      "protein": 6.45
    },
    "interFoodType": "D7",
    "userId": "123456789"
  }
]

export {
  expectedSuccessBuggedVal,
  expectedSuccessInterFoodImports,
  expectedSuccessInterFoodImportsSameDay,
  expectedSuccessInterFoodImportsFoodMissingInMiddleWeek,
  expectedSoupWithSecondCourse
}
