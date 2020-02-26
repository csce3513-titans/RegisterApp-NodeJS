import express from 'express';
import { RouteLookup } from '../controllers/lookups/routingLookup';
import * as EmployeeDetailRouteController from '../controllers/employeeDetailRouteController';
// import * as SignInRouteController from '../controllers/signInRouteController';

function employeeDetailRoutes(server: express.Express) {
	// server.get('/employeeDetail', function (req, res) {
	// 	res.send(req);
	//   });
	server.get('/employeeDetail', EmployeeDetailRouteController.start);
	server.get('/employeeDetail/:employeeId', EmployeeDetailRouteController.startWithEmployee);

	server.post(RouteLookup.EmployeeDetail, EmployeeDetailRouteController.startWithEmployee);

	// server.delete(RouteLookup.API + RouteLookup.SignOut, SignInRouteController.clearActiveUser);
}

module.exports.routes = employeeDetailRoutes;
