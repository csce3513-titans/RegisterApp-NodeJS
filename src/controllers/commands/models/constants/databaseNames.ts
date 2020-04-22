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
	PRICE = 'price',
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

export enum TransactionFieldName {
	ID = 'id',
	Total = 'total',
	CashierId = 'cashierid',
	CreatedOn = 'createdon',
	Type = 'transactiontype',
	ReferenceId = 'transactionreferenceid',
	Completed = 'completed'
}

export enum TransactionEntryFieldName {
	ID = 'id',
	Price = 'price',
	Quantity = 'quantity',
	CreatedOn = 'createdon',
	ProductId = 'productid',
	TransactionId = 'transactionid'
}
