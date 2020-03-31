import { Express } from 'express';
import { RouteLookup } from '../controllers/lookups/routingLookup';
import * as routeController from '../controllers/transactionRouteController';

module.exports.routes = function(server: Express) {
	// Get page
	server.get(RouteLookup.Transaction, routeController.getPage);

	// Add product to transaction
	server.post(RouteLookup.API + RouteLookup.Transaction + RouteLookup.TransactionIdParameter + RouteLookup.ProductCodeParameter, routeController.addTransactionEntry);

	// Update product in transaction
	server.put(RouteLookup.API + RouteLookup.Transaction + RouteLookup.TransactionIdParameter + RouteLookup.ProductCodeParameter, routeController.updateTransactionEntry);

	// Close a transaction
	// Query parameter `?action=complete|cancel` specifies what to do
	server.delete(RouteLookup.API + RouteLookup.Transaction + RouteLookup.TransactionIdParameter, routeController.closeTransaction);
	// Remove a product from a transaction
	server.delete(RouteLookup.API + RouteLookup.Transaction + RouteLookup.TransactionIdParameter + RouteLookup.ProductCodeParameter, routeController.removeTransactionEntry);
};
