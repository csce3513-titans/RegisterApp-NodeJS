import express from 'express';
import { RouteLookup } from '../controllers/lookups/routingLookup';
import * as employeeDetailRouteController from '../controllers/employeeDetailRouteController';

function employeeDetailRoutes(server: express.Express) {
	server.get(RouteLookup.EmployeeDetail, employeeDetailRouteController.start);
}

module.exports.routes = employeeDetailRoutes;
