@RestResource(urlMapping='/Accounts/*')
global with sharing class AccountService {

    @HttpGet
    global static List<Account> getAccounts() {
        RestRequest req = RestContext.request;
        String offsetStr = req.params.get('offset');
        Integer offset = (offsetStr != null) ? Integer.valueOf(offsetStr) : 0;
        Integer batchSize = 200;

        List<Account> accounts = [
            SELECT Id, Name, DNI__c,Tipo_de_documento__c, Campus__c, Marca__c, LastModifiedDate
            FROM Account
            LIMIT :batchSize OFFSET :offset
        ];

        return accounts;
    }
	
    @HttpPost
    global static String insertAccountFromSMART() {
        try {
            RestRequest req = RestContext.request;
            String requestBody = req.requestBody.toString();

            Account accountData = (Account) JSON.deserialize(requestBody, Account.class);

            insert accountData;

            return 'Cuenta insertada exitosamente con ID: ' + accountData.Id;
        } catch (Exception e) {
            return 'Error al insertar la cuenta: ' + e.getMessage();
        }
    }

    
    global static String runBatch() {
        try {
            Database.executeBatch(new AccountBatchProcess(), 200);
            return 'Batch ejecutado exitosamente.';
        } catch (Exception e) {
            return 'Error al ejecutar el batch: ' + e.getMessage();
        }
    }

    global static String scheduleBatch() {
        try {
            String cronExp = '0 0 * * * ?'; // Cron para cada hora
            System.schedule('Hourly Account Batch Job', cronExp, new AccountBatchScheduler());
            return 'Batch programado para cada hora.';
        } catch (Exception e) {
            return 'Error al programar el batch: ' + e.getMessage();
        }
    }
}