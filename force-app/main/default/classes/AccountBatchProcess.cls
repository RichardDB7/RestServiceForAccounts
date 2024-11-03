global class AccountBatchProcess implements Database.Batchable<SObject>, Database.Stateful {

    global Database.QueryLocator start(Database.BatchableContext BC) {
        return Database.getQueryLocator([
            SELECT Id, Name, DNI__c, LastModifiedDate
            FROM Account
        ]);
    }

    global void execute(Database.BatchableContext BC, List<SObject> scope) {
        List<Account> accountsToUpdate = new List<Account>();

        for (Account acc : (List<Account>) scope) {
            acc.DNI__c = null;
            accountsToUpdate.add(acc);
        }

        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }

    global void finish(Database.BatchableContext BC) {
    }
}