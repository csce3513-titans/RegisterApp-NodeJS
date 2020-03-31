// Request object definitions
export interface ProductSaveRequest {
	id?: string;
	count: number;
	lookupCode: string;
}

export interface SignInRequest {
	employeeId: string;
	password: string;
}

export interface EmployeeSaveRequest {
	id?: string;
	active: boolean;
	lastName: string;
	password: string;
	firstName: string;
	managerId?: string;
	classification: number;
	isInitialEmployee?: boolean;
}

export interface TransactionPageResponse {
	transactionId: string;
}
export interface TransactionResponse {
	transaction: any;
}
// End request object definitions

// Response object definitions
// Response data object definitions
export interface Product {
	id: string;
	count: number;
	createdOn: string;
	lookupCode: string;
}

export interface Employee {
	id: string;
	active: boolean;
	lastName: string;
	createdOn: Date;
	firstName: string;
	managerId: string;
	employeeId: string;
	classification: number;
}

export interface ActiveUser {
	id: string;
	name: string;
	employeeId: string;
	classification: number;
}

export interface EmployeeType {
	value: number;
	label: string;
}

// TODO: Transaction types
export interface Transaction {
	id: string;
	createdOn: Date;
	employeeId: string;
}

export interface TransactionEntry {
	id: string;
	transactionId: string;
	lookupCode: string;
	quantity: number;
}
// End response data object definitions

// Page response data
export interface PageResponse {
	errorMessage?: string;
}

export interface MainMenuPageResponse extends PageResponse {
	isElevatedUser: boolean;
}

export interface ProductDetailPageResponse extends PageResponse {
	product: Product;
	isElevatedUser: boolean;
}

export interface ProductListingPageResponse extends PageResponse {
	products: Product[];
	isElevatedUser: boolean;
}
export interface EmployeeDetailPageResponse extends PageResponse {
	employee: Employee;
	isInitialEmployee: boolean;
	employeeTypes: EmployeeType[];
}
// End page response data

// API response data
export interface ApiResponse {
	redirectUrl?: string;
	errorMessage?: string;
}

export interface ProductSaveResponse extends ApiResponse {
	product: Product;
}
export interface EmployeeSaveResponse extends ApiResponse {
	employee: Employee;
}
// End API response data
// End response object definitions

export interface CommandResponse<T> {
	data?: T;
	status: number;
	message?: string;
}
