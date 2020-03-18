export enum DatabaseTableName {
	PRODUCT = 'product',
	EMPLOYEE = 'employee',
	ACTIVE_USER = 'activeuser',
	TRANSACTION = 'transaction',
	TRANSACTION_ENTRY = 'transactionentry'
}

export enum ProductFieldName {
	ID = 'id',
	COUNT = 'count',
	CREATED_ON = 'createdon',
	LOOKUP_CODE = 'lookupcode'
}

export enum EmployeeFieldName {
	ID = 'id',
	Active = 'active',
	Password = 'password',
	LastName = 'lastname',
	CreatedOn = 'createdon',
	FirstName = 'firstname',
	ManagerId = 'managerid',
	EmployeeId = 'employeeid',
	Classification = 'classification'
}

export enum ActiveUserFieldName {
	ID = 'id',
	Name = 'name',
	CreatedOn = 'createdon',
	EmployeeId = 'employeeid',
	SessionKey = 'sessionkey',
	Classification = 'classification'
}

// TODO: Finish creating transaction models
export enum TransactionFieldName {
	ID = 'id',
	CREATED_ON = 'createdon',
	EMPLOYEE_ID = 'employeeid'
}

export enum TransactionEntryFieldName {
	ID = 'id',
	TRANSACTION_ID = 'transactionid',
	LOOKUP_CODE = 'lookupcode',
	QUANTITY = 'quantity'
}
