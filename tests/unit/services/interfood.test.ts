import 'reflect-metadata'
import dependencyInjectorLoader from '../../../src/loaders/dependencyInjector';
import { InterfoodService } from "../../../src/services";
import Container from 'typedi';
import { Tabletojson } from 'tabletojson';
import { expectedSuccessInterFoodImports, expectedSuccessInterFoodImportsFoodMissingInMiddleWeek } from './datas';

describe('User', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Import interfood', () => {
    test('Should success', async () => {

      dependencyInjectorLoader()
      const interFood = Container.get(InterfoodService)

      const userId = "123456789"
      const multiLine: string = `
      2022-05-16;D9;Csirkemell Holstein módra, zöldségekkel, rizzsel;
      2022-05-17;D7;Csirkemell sajtos bundában, zöldséges barnarizs;
      2022-05-18;D13;Bakonyi sertésszelet, tészta köret;
      2022-05-19;D6;Thai zöldséges csirkés tészta;
      2022-05-19;D7;Mátrai borzas csirkemell, rizses zöldség;
      2022-05-20;D7;Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma);
      `
      const tabelToJsonConvertUrl = jest
        .spyOn(Tabletojson, 'convertUrl')
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

      const interfoodImports = await interFood.import(userId, multiLine);

      expect(interfoodImports).toEqual(expectedSuccessInterFoodImports);
      expect(tabelToJsonConvertUrl).toHaveBeenCalledTimes(6);

    });

    test('Should success, all food in same day', async () => {

      dependencyInjectorLoader()
      const interFood = Container.get(InterfoodService)

      const userId = "123456789"
      const multiLine: string = `
      2022-05-16;D9;Csirkemell Holstein módra, zöldségekkel, rizzsel;
      2022-05-16;D7;Csirkemell sajtos bundában, zöldséges barnarizs;
      2022-05-16;D13;Bakonyi sertésszelet, tészta köret;
      2022-05-16;D6;Thai zöldséges csirkés tészta;
      2022-05-16;D7;Mátrai borzas csirkemell, rizses zöldség;
      2022-05-16;D7;Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma);
      `
      const tabelToJsonConvertUrl = jest
        .spyOn(Tabletojson, 'convertUrl')
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

      const interfoodImports = await interFood.import(userId, multiLine);

      expect(interfoodImports).toEqual(expectedSuccessInterFoodImports);
      expect(tabelToJsonConvertUrl).toHaveBeenCalledTimes(6);
      // tabelToJsonConvertUrl.

      const interFoodTypes = ["D9", "D7", "D13", "D6", "D7", "D7",]
      interFoodTypes.forEach(iftypes => {
        expect(tabelToJsonConvertUrl).toHaveBeenCalledWith(
          `https://www.interfood.hu/getosszetevok/?k=${iftypes}&d=2022-05-16&l=hu`, expect.any(Function),
        )
      })

    });

    test('Should success, all food in random days', async () => {

      dependencyInjectorLoader()
      const interFood = Container.get(InterfoodService)

      const userId = "123456789"
      const multiLine: string = `
      2022-05-16;D9;Csirkemell Holstein módra, zöldségekkel, rizzsel;
      2022-05-17;D7;Csirkemell sajtos bundában, zöldséges barnarizs;
      2022-05-17;D13;Bakonyi sertésszelet, tészta köret;
      2022-05-19;D6;Thai zöldséges csirkés tészta;
      2022-05-20;D7;Mátrai borzas csirkemell, rizses zöldség;
      2022-05-21;D7;Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma);
      `
      const tabelToJsonConvertUrl = jest
        .spyOn(Tabletojson, 'convertUrl')
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

      const interfoodImports = await interFood.import(userId, multiLine);

      expect(interfoodImports).toEqual(expectedSuccessInterFoodImports);
      expect(tabelToJsonConvertUrl).toHaveBeenCalledTimes(6);
    });


    test('Should success, no food in middleweek', async () => {

      dependencyInjectorLoader()
      const interFood = Container.get(InterfoodService)

      const userId = "123456789"
      const multiLine: string = `
      2022-05-16;D9;Csirkemell Holstein módra, zöldségekkel, rizzsel;
      2022-05-17;D7;Csirkemell sajtos bundában, zöldséges barnarizs;
      2022-05-19;D13;Bakonyi sertésszelet, tészta köret;
      2022-05-19;D6;Thai zöldséges csirkés tészta;
      2022-05-20;D7;Mátrai borzas csirkemell, rizses zöldség;
      2022-05-21;D7;Cordon bleu pulykamell, párolt zöldekkel (c.bab, bébi répa, lila hagyma);
      `
      const tabelToJsonConvertUrl = jest
        .spyOn(Tabletojson, 'convertUrl')
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

      const interfoodImports = await interFood.import(userId, multiLine);

      expect(interfoodImports).toEqual(expectedSuccessInterFoodImportsFoodMissingInMiddleWeek);
      expect(tabelToJsonConvertUrl).toHaveBeenCalledTimes(6);
    });

  })
})