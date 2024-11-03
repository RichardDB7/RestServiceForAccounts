@isTest
private class AccountServiceTest {

    @isTest
    static void testGetAccounts() {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 5; i++) {
            accounts.add(new Account(Name = 'Test Account ' + i, DNI__c = 12345678 + i));
        }
        insert accounts;

        RestRequest req = new RestRequest();
        req.requestURI = '/services/apexrest/Accounts/';
        req.httpMethod = 'GET';
        req.addParameter('offset', '0');
        RestContext.request = req;

        RestResponse res = new RestResponse();
        RestContext.response = res;

        List<Account> result = AccountService.getAccounts();

        System.assertEquals(5, result.size(), 'Debe haber 5 cuentas recuperadas.');
        System.assertEquals('Test Account 0', result[0].Name, 'El nombre de la cuenta debe coincidir.');
    }

    @isTest
    static void testRunBatch() {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 5; i++) {
            accounts.add(new Account(Name = 'Test Account ' + i, DNI__c = 12345678 + i));
        }
        insert accounts;

        String result = AccountService.runBatch();

        System.assertEquals('Batch ejecutado exitosamente.', result, 'El batch debe ejecutarse correctamente.');
        
        List<Account> updatedAccounts = [SELECT DNI__c FROM Account WHERE DNI__c = null];
        System.assertEquals(5, updatedAccounts.size(), 'Todas las cuentas deben haber sido actualizadas con DNI__c en null.');
    }

    @isTest
    static void testScheduleBatch() {
        String result = AccountService.scheduleBatch();

        System.assertEquals('Batch programado para cada hora.', result, 'El batch debe programarse correctamente.');
        
        CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered 
                          FROM CronTrigger 
                          WHERE CronExpression = '0 0 * * * ?'];
        System.assertNotEquals(null, ct, 'Debe haber un trabajo programado.');
    }

    @isTest
    static void testAccountBatchProcess() {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 5; i++) {
            accounts.add(new Account(Name = 'Test Account ' + i, DNI__c = 12345678 + i));
        }
        insert accounts;

        Test.startTest();
        Database.executeBatch(new AccountBatchProcess(), 200);
        Test.stopTest();

        List<Account> updatedAccounts = [SELECT DNI__c FROM Account WHERE DNI__c = null];
        System.assertEquals(5, updatedAccounts.size(), 'Todas las cuentas deben haber sido actualizadas con DNI__c en null.');
    }

    @isTest
    static void testAccountBatchScheduler() {
        Test.startTest();
        AccountBatchScheduler scheduler = new AccountBatchScheduler();
        String sch = '0 0 12 * * ?'; 
        System.schedule('Test Batch Scheduler', sch, scheduler);
        Test.stopTest();

        CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered 
                          FROM CronTrigger 
                          WHERE CronExpression = '0 0 12 * * ?'];
        System.assertNotEquals(null, ct, 'El batch debe estar programado.');
    }
}