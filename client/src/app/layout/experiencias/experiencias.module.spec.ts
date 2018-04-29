import { ExperienciasModule } from './experiencias.module';

describe('ExperienciasModule', () => {
    let blankPageModule: ExperienciasModule;

    beforeEach(() => {
        blankPageModule = new ExperienciasModule();
    });

    it('should create an instance', () => {
        expect(blankPageModule).toBeTruthy();
    });
});
