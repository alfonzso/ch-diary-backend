import 'reflect-metadata'

import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
// enableFetchMocks()

import dependencyInjectorLoader from '../../../src/loaders/dependencyInjector';
import { InterfoodService } from "../../../src/services";
import Container from 'typedi';
import { Tabletojson } from 'tabletojson';
import { expectedSuccessBuggedVal, expectedSuccessInterFoodImports, expectedSuccessInterFoodImportsFoodMissingInMiddleWeek, expectedSuccessInterFoodImportsSameDay } from './datas';

// import * as faf from 'cross-fetch';
enableFetchMocks()

describe('User', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Import interfood', () => {
    test('Should success', async () => {

      dependencyInjectorLoader()
      const interFood = Container.get(InterfoodService)

      const userId = "123456789"
      const multiLine: string[] = [
        "2022-05-16;D;9;Csirkemell Holstein módra, zöldségekkel, rizzsel;",
        "2022-05-17;D;7;Csirkemell sajtos bundában, zöldséges barnarizs;",
        "2022-05-18;D;13;Bakonyi sertésszelet, tészta köret;",
        "2022-05-19;D;6;Thai zöldséges csirkés tészta;",
        "2022-05-19;D;7;Mátrai borzas csirkemell, rizses zöldség;",
        "2022-05-20;D;7;Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma);",
      ]
      const tabelToJsonConvertUrl = jest
        .spyOn(Tabletojson, 'convert')
        .mockImplementation((url: string, callback: any): any => {
          return [[
            { '0': 'Átlagos tápérték', '1': '1 adagban', '2': '100g-ban' },
            { '0': 'Energia', '1': '917 kcal', '2': '203.78 kcal' },
            { '0': 'Zsír', '1': '23g', '2': '5.11g' },
            { '0': '- amelyből telített zsírsav', '1': '8.5g', '2': '1.89g' },
            { '0': 'Szénhidrát', '1': '111.6g', '2': '24.8g' },
            { '0': '- amelyből cukrok', '1': '11.1g', '2': '2.47g' },
            { '0': 'Fehérje', '1': '59.2g', '2': '13.16g' },
            { '0': 'Só', '1': '4.45g', '2': '0.99g' }
          ]]
        });

      fetchMock.mockResponse('>Nettó tömeg: 200ggggg')
      const interfoodImports = await interFood.import(userId, multiLine);

      expect(interfoodImports).toEqual(expectedSuccessInterFoodImports);
      expect(tabelToJsonConvertUrl).toHaveBeenCalledTimes(6);

    });

    test('Should success, wrong order of interfoodData', async () => {

      dependencyInjectorLoader()
      const interFood = Container.get(InterfoodService)

      const userId = "123456789"
      const multiLine: string[] = [
        "2022-05-20;D;7;Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma);",
        "2022-05-19;D;7;Mátrai borzas csirkemell, rizses zöldség;",
        "2022-05-19;D;6;Thai zöldséges csirkés tészta;",
        "2022-05-18;D;13;Bakonyi sertésszelet, tészta köret;",
        "2022-05-17;D;7;Csirkemell sajtos bundában, zöldséges barnarizs;",
        "2022-05-16;D;9;Csirkemell Holstein módra, zöldségekkel, rizzsel;",
      ]
      const tabelToJsonConvertUrl = jest
        .spyOn(Tabletojson, 'convert')
        .mockImplementation((url: string, callback: any): any => {
          return [[
            { '0': 'Átlagos tápérték', '1': '1 adagban', '2': '100g-ban' },
            { '0': 'Energia', '1': '917 kcal', '2': '203.78 kcal' },
            { '0': 'Zsír', '1': '23g', '2': '5.11g' },
            { '0': '- amelyből telített zsírsav', '1': '8.5g', '2': '1.89g' },
            { '0': 'Szénhidrát', '1': '111.6g', '2': '24.8g' },
            { '0': '- amelyből cukrok', '1': '11.1g', '2': '2.47g' },
            { '0': 'Fehérje', '1': '59.2g', '2': '13.16g' },
            { '0': 'Só', '1': '4.45g', '2': '0.99g' }
          ]]
        });
      fetchMock.mockResponse('>Nettó tömeg: 200ggggg')

      const interfoodImports = await interFood.import(userId, multiLine);

      console.log(
        interfoodImports
      )

      expect(interfoodImports).toEqual(expectedSuccessInterFoodImports);
      // expect(interfoodImports).toEqual();
      expect(tabelToJsonConvertUrl).toHaveBeenCalledTimes(6);

    });

    test('Should success, all food in same day', async () => {

      dependencyInjectorLoader()
      const interFood = Container.get(InterfoodService)

      const userId = "123456789"
      const multiLine: string[] = [
        "2022-05-16;D;9;Csirkemell Holstein módra, zöldségekkel, rizzsel;",
        "2022-05-16;D;7;Csirkemell sajtos bundában, zöldséges barnarizs;",
        "2022-05-16;D;13;Bakonyi sertésszelet, tészta köret;",
        "2022-05-16;D;6;Thai zöldséges csirkés tészta;",
        "2022-05-16;D;7;Mátrai borzas csirkemell, rizses zöldség;",
        "2022-05-16;D;7;Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma);",
      ]
      const tabelToJsonConvertUrl = jest
        .spyOn(Tabletojson, 'convert')
        .mockImplementation((url: string, callback: any): any => {
          return [[
            { '0': 'Átlagos tápérték', '1': '1 adagban', '2': '100g-ban' },
            { '0': 'Energia', '1': '917 kcal', '2': '203.78 kcal' },
            { '0': 'Zsír', '1': '23g', '2': '5.11g' },
            { '0': '- amelyből telített zsírsav', '1': '8.5g', '2': '1.89g' },
            { '0': 'Szénhidrát', '1': '111.6g', '2': '24.8g' },
            { '0': '- amelyből cukrok', '1': '11.1g', '2': '2.47g' },
            { '0': 'Fehérje', '1': '59.2g', '2': '13.16g' },
            { '0': 'Só', '1': '4.45g', '2': '0.99g' }
          ]]
        });

      fetchMock.mockResponse('>Nettó tömeg: 200ggggg')
      const interfoodImports = await interFood.import(userId, multiLine);

      const fixed = expectedSuccessInterFoodImportsSameDay.map(val => {
        return { ...val, createdAt: new Date(val.createdAt) }
      })

      expect(interfoodImports).toEqual(fixed);
      expect(tabelToJsonConvertUrl).toHaveBeenCalledTimes(6);

      expect(fetchMock.mock.calls).toEqual(
        [
          [ 'https://www.interfood.hu/getosszetevok/?k=D6&d=2022-05-16&l=hu' ],
          [ 'https://www.interfood.hu/getosszetevok/?k=D7&d=2022-05-16&l=hu' ],
          [ 'https://www.interfood.hu/getosszetevok/?k=D7&d=2022-05-16&l=hu' ],
          [ 'https://www.interfood.hu/getosszetevok/?k=D7&d=2022-05-16&l=hu' ],
          [ 'https://www.interfood.hu/getosszetevok/?k=D9&d=2022-05-16&l=hu' ],
          [ 'https://www.interfood.hu/getosszetevok/?k=D13&d=2022-05-16&l=hu' ]
        ]
      )

    });

    test('Should success, all food in random days', async () => {

      dependencyInjectorLoader()
      const interFood = Container.get(InterfoodService)

      const userId = "123456789"
      const multiLine: string[] = [
        "2022-05-16;D;9;Csirkemell Holstein módra, zöldségekkel, rizzsel;",
        "2022-05-17;D;7;Csirkemell sajtos bundában, zöldséges barnarizs;",
        "2022-05-17;D;13;Bakonyi sertésszelet, tészta köret;",
        "2022-05-19;D;6;Thai zöldséges csirkés tészta;",
        "2022-05-20;D;7;Mátrai borzas csirkemell, rizses zöldség;",
        "2022-05-21;D;7;Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma);",
      ]
      const tabelToJsonConvertUrl = jest
        .spyOn(Tabletojson, 'convert')
        .mockImplementation((url: string, callback: any): any => {
          return [[
            { '0': 'Átlagos tápérték', '1': '1 adagban', '2': '100g-ban' },
            { '0': 'Energia', '1': '917 kcal', '2': '203.78 kcal' },
            { '0': 'Zsír', '1': '23g', '2': '5.11g' },
            { '0': '- amelyből telített zsírsav', '1': '8.5g', '2': '1.89g' },
            { '0': 'Szénhidrát', '1': '111.6g', '2': '24.8g' },
            { '0': '- amelyből cukrok', '1': '11.1g', '2': '2.47g' },
            { '0': 'Fehérje', '1': '59.2g', '2': '13.16g' },
            { '0': 'Só', '1': '4.45g', '2': '0.99g' }
          ]]
        });

      fetchMock.mockResponse('>Nettó tömeg: 200ggggg')
      const interfoodImports = await interFood.import(userId, multiLine);

      expect(interfoodImports).toEqual(expectedSuccessInterFoodImports);
      expect(tabelToJsonConvertUrl).toHaveBeenCalledTimes(6);
    });

    test('Should success, no food in middleweek', async () => {

      dependencyInjectorLoader()
      const interFood = Container.get(InterfoodService)

      const userId = "123456789"
      const multiLine: string[] = [
        "2022-05-16;D;9;Csirkemell Holstein módra, zöldségekkel, rizzsel;",
        "2022-05-17;D;7;Csirkemell sajtos bundában, zöldséges barnarizs;",
        "2022-05-19;D;13;Bakonyi sertésszelet, tészta köret;",
        "2022-05-19;D;6;Thai zöldséges csirkés tészta;",
        "2022-05-20;D;7;Mátrai borzas csirkemell, rizses zöldség;",
        "2022-05-21;D;7;Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma);",
      ]
      const tabelToJsonConvertUrl = jest
        .spyOn(Tabletojson, 'convert')
        .mockImplementation((url: string, callback: any): any => {
          return [[
            { '0': 'Átlagos tápérték', '1': '1 adagban', '2': '100g-ban' },
            { '0': 'Energia', '1': '917 kcal', '2': '203.78 kcal' },
            { '0': 'Zsír', '1': '23g', '2': '5.11g' },
            { '0': '- amelyből telített zsírsav', '1': '8.5g', '2': '1.89g' },
            { '0': 'Szénhidrát', '1': '111.6g', '2': '24.8g' },
            { '0': '- amelyből cukrok', '1': '11.1g', '2': '2.47g' },
            { '0': 'Fehérje', '1': '59.2g', '2': '13.16g' },
            { '0': 'Só', '1': '4.45g', '2': '0.99g' }
          ]]
        });

      fetchMock.mockResponse('>Nettó tömeg: 200ggggg')

      const interfoodImports = await interFood.import(userId, multiLine);

      const fixed = expectedSuccessInterFoodImportsFoodMissingInMiddleWeek.map(val => {
        return { ...val, createdAt: new Date(val.createdAt) }
      })

      expect(interfoodImports).toEqual(fixed);
      expect(tabelToJsonConvertUrl).toHaveBeenCalledTimes(6);
    });

    test('Should success, bugged somehow', async () => {

      dependencyInjectorLoader()
      const interFood = Container.get(InterfoodService)

      const userId = "123456789"
      const multiLine: string[] = [
        "2022-05-23;D;10;Thai pirított marha csíkok, tojásos barnarizs;",
        "2022-05-24;D;6;Bangkoki marha (távol-keleti szósz, tészta, marhahús);",
        "2022-05-24;D;9;Roston csirkemell, négysajtmártás, párolt karotta borsóval, kukoricával;",
        "2022-05-25;D;10;Vadas marhatokány (light) spagetti;",
        "2022-05-26;D;9;Brokkolival töltött csirke, zöldségekkel;",
        "2022-05-27;D;7;Rántott fűszeres csirkecomb, amerikai káposztasaláta;",
      ]
      const tabelToJsonConvert = jest
        .spyOn(Tabletojson, 'convert')
        .mockImplementation((url: string, callback: any): any => {
          return [[
            { '0': 'Átlagos tápérték', '1': '1 adagban', '2': '100g-ban' },
            { '0': 'Energia', '1': '917 kcal', '2': '203.78 kcal' },
            { '0': 'Zsír', '1': '23g', '2': '5.11g' },
            { '0': '- amelyből telített zsírsav', '1': '8.5g', '2': '1.89g' },
            { '0': 'Szénhidrát', '1': '111.6g', '2': '24.8g' },
            { '0': '- amelyből cukrok', '1': '11.1g', '2': '2.47g' },
            { '0': 'Fehérje', '1': '59.2g', '2': '13.16g' },
            { '0': 'Só', '1': '4.45g', '2': '0.99g' }
          ]]
        });

      fetchMock.mockResponse('>Nettó tömeg: 200ggggg')

      const interfoodImports = await interFood.import(userId, multiLine);

      const fixed = expectedSuccessBuggedVal.map(val => {
        return { ...val, createdAt: new Date(val.createdAt) }
      })

      expect(interfoodImports).toEqual(fixed);

    });

  })
})