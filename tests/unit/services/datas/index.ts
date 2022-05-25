
const expectedSuccessInterFoodImports = [
  {
    userId: '123456789',
    foodName: 'Csirkemell Holstein módra, zöldségekkel, rizzsel',
    foodPortion: 450,
    createdAt: new Date('2022-05-16T12:00:00.000Z'),
    interFoodType: 'D9',
    foodProp: { gramm: 100, kcal: 203.78, fat: 5.11, ch: 24.8, portein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Csirkemell sajtos bundában, zöldséges barnarizs',
    foodPortion: 450,
    createdAt: new Date('2022-05-17T12:00:00.000Z'),
    interFoodType: 'D7',
    foodProp: { gramm: 100, kcal: 203.78, fat: 5.11, ch: 24.8, portein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Bakonyi sertésszelet, tészta köret',
    foodPortion: 450,
    createdAt: new Date('2022-05-18T12:00:00.000Z'),
    interFoodType: 'D13',
    foodProp: { gramm: 100, kcal: 203.78, fat: 5.11, ch: 24.8, portein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Thai zöldséges csirkés tészta',
    foodPortion: 450,
    createdAt: new Date('2022-05-19T12:00:00.000Z'),
    interFoodType: 'D6',
    foodProp: { gramm: 100, kcal: 203.78, fat: 5.11, ch: 24.8, portein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Mátrai borzas csirkemell, rizses zöldség',
    foodPortion: 450,
    createdAt: new Date('2022-05-20T12:00:00.000Z'),
    interFoodType: 'D7',
    foodProp: { gramm: 100, kcal: 203.78, fat: 5.11, ch: 24.8, portein: 13.16 }
  },
  {
    userId: '123456789',
    foodName: 'Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma)',
    foodPortion: 450,
    createdAt: new Date('2022-05-21T12:00:00.000Z'),
    interFoodType: 'D7',
    foodProp: { gramm: 100, kcal: 203.78, fat: 5.11, ch: 24.8, portein: 13.16 }
  }
]

const expectedSuccessInterFoodImportsFoodMissingInMiddleWeek = [
  {
    "createdAt": "2022-05-16T12:00:00.000Z",
    "foodName": "Csirkemell Holstein módra, zöldségekkel, rizzsel",
    "foodPortion": 450,
    "foodProp": {
      "ch": 24.8,
      "fat": 5.11,
      "gramm": 100,
      "kcal": 203.78,
      "portein": 13.16
    },
    "interFoodType": "D9",
    "userId": "123456789"
  },
  {
    "createdAt": "2022-05-17T12:00:00.000Z",
    "foodName": "Csirkemell sajtos bundában, zöldséges barnarizs",
    "foodPortion": 450,
    "foodProp": {
      "ch": 24.8,
      "fat": 5.11,
      "gramm": 100,
      "kcal": 203.78,
      "portein": 13.16
    },
    "interFoodType": "D7",
    "userId": "123456789"
  },
  {
    "createdAt": "2022-05-19T12:00:00.000Z",
    "foodName": "Thai zöldséges csirkés tészta",
    "foodPortion": 450,
    "foodProp": {
      "ch": 24.8,
      "fat": 5.11,
      "gramm": 100,
      "kcal": 203.78,
      "portein": 13.16
    },
    "interFoodType": "D6",
    "userId": "123456789"
  },
  {
    "createdAt": "2022-05-20T12:00:00.000Z",
    "foodName": "Bakonyi sertésszelet, tészta köret",
    "foodPortion": 450,
    "foodProp": {
      "ch": 24.8,
      "fat": 5.11,
      "gramm": 100,
      "kcal": 203.78,
      "portein": 13.16
    },
    "interFoodType": "D13",
    "userId": "123456789"
  },
  {
    "createdAt": "2022-05-21T12:00:00.000Z",
    "foodName": "Mátrai borzas csirkemell, rizses zöldség",
    "foodPortion": 450,
    "foodProp": {
      "ch": 24.8,
      "fat": 5.11,
      "gramm": 100,
      "kcal": 203.78,
      "portein": 13.16
    },
    "interFoodType": "D7",
    "userId": "123456789"
  },
  {
    "createdAt": "2022-05-22T12:00:00.000Z",
    "foodName": "Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma)",
    "foodPortion": 450,
    "foodProp": {
      "ch": 24.8,
      "fat": 5.11,
      "gramm": 100,
      "kcal": 203.78,
      "portein": 13.16
    },
    "interFoodType": "D7",
    "userId": "123456789"
  }
]

const expectedSuccessInterFoodImportsSameDay = [
  {
    "createdAt": '2022-05-16T12:00:00.000Z', "foodName": "Thai zöldséges csirkés tészta", "foodPortion": 450,
    "foodProp": { "ch": 24.8, "fat": 5.11, "gramm": 100, "kcal": 203.78, "portein": 13.16 }, "interFoodType": "D6", "userId": "123456789"
  },
  {
    "createdAt": '2022-05-17T12:00:00.000Z', "foodName": "Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma)",
    "foodPortion": 450, "foodProp": { "ch": 24.8, "fat": 5.11, "gramm": 100, "kcal": 203.78, "portein": 13.16 }, "interFoodType": "D7", "userId": "123456789"
  },
  {
    "createdAt": '2022-05-18T12:00:00.000Z', "foodName": "Csirkemell sajtos bundában, zöldséges barnarizs", "foodPortion": 450,
    "foodProp": { "ch": 24.8, "fat": 5.11, "gramm": 100, "kcal": 203.78, "portein": 13.16 }, "interFoodType": "D7", "userId": "123456789"
  }, {
    "createdAt": '2022-05-19T12:00:00.000Z', "foodName": "Mátrai borzas csirkemell, rizses zöldség", "foodPortion": 450,
    "foodProp": { "ch": 24.8, "fat": 5.11, "gramm": 100, "kcal": 203.78, "portein": 13.16 }, "interFoodType": "D7", "userId": "123456789"
  }, {
    "createdAt": '2022-05-20T12:00:00.000Z', "foodName": "Csirkemell Holstein módra, zöldségekkel, rizzsel", "foodPortion": 450,
    "foodProp": { "ch": 24.8, "fat": 5.11, "gramm": 100, "kcal": 203.78, "portein": 13.16 }, "interFoodType": "D9", "userId": "123456789"
  },
  {
    "createdAt": '2022-05-21T12:00:00.000Z', "foodName": "Bakonyi sertésszelet, tészta köret", "foodPortion": 450,
    "foodProp": { "ch": 24.8, "fat": 5.11, "gramm": 100, "kcal": 203.78, "portein": 13.16 }, "interFoodType": "D13", "userId": "123456789"
  }
]

export {
  expectedSuccessInterFoodImports,
  expectedSuccessInterFoodImportsSameDay,
  expectedSuccessInterFoodImportsFoodMissingInMiddleWeek
}