import { ReportesModule } from './reportes.module';

describe('ReportesModule', () => {
    let blankPageModule: ReportesModule;

    beforeEach(() => {
        blankPageModule = new ReportesModule();
    });

    it('should create an instance', () => {
        expect(blankPageModule).toBeTruthy();
    });
});
