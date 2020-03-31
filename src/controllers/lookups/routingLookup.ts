export enum ParameterLookup {
	ProductId = 'productId',
	ProductCode = 'productCode',
	EmployeeId = 'employeeId'
}

export enum QueryParameterLookup {
	ErrorCode = 'errorCode',
	EmployeeId = 'employeeId'
}

export enum ViewNameLookup {
	SignIn = 'signIn',
	MainMenu = 'mainMenu',
	ProductDetail = 'productDetail',
	ProductListing = 'productListing',
	EmployeeDetail = 'employeeDetail',
	Transaction = 'transaction'
}

export enum RouteLookup {
	// Page routing
	SignIn = '',
	SignOut = '/signOut',
	MainMenu = '/mainMenu',
	ProductDetail = '/productDetail',
	ProductListing = '/productListing',
	EmployeeDetail = '/employeeDetail',
	Transaction = '/transaction',

	// Page routing - parameters
	ProductIdParameter = '/:productId',
	ProductCodeParameter = '/:productCode',
	EmployeeIdParameter = '/:employeeId',
	TransactionIdParameter = '/:transactionId',
	// End page routing - parameters
	// End page routing

	// API routing
	API = '/api',
	// End API routing
}
