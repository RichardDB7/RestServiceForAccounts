global class AccountBatchScheduler implements Schedulable {
    global void execute(SchedulableContext sc) {
        AccountBatchProcess batch = new AccountBatchProcess();
        Database.executeBatch(batch, 200); 
    }
}