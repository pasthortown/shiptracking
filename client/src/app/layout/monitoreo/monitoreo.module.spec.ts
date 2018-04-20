import { MonitoreoModule } from './monitoreo.module';

describe('MonitoreoModule', () => {
    let blankPageModule: MonitoreoModule;

    beforeEach(() => {
        blankPageModule = new MonitoreoModule();
    });

    it('should create an instance', () => {
        expect(blankPageModule).toBeTruthy();
    });
});
