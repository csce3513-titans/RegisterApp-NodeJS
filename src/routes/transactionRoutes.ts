import { Express } from 'express';
import { RouteLookup } from '../controllers/lookups/routingLookup';
import * as routeController from '../controllers/transactionRouteController';

module.exports.routes = function(server: Express) {
	// Get page
	server.get(RouteLookup.Transaction, routeController.getPage);
	// Get transaction
	server.get(RouteLookup.API + RouteLookup.Transaction + RouteLookup.TransactionIdParameter, routeController.getTransaction);

	// Create transaction
	server.post(RouteLookup.API + RouteLookup.Transaction, routeController.createTransaction);
	// Add product to transaction
	server.post(RouteLookup.API + RouteLookup.Transaction + RouteLookup.TransactionIdParameter + RouteLookup.ProductIdParameter, routeController.addProduct);

	// Update product in transaction
	server.put(RouteLookup.API + RouteLookup.Transaction + RouteLookup.TransactionIdParameter + RouteLookup.ProductIdParameter, routeController.updateProduct);

	// Close a transaction
	// Query parameter `?action=complete|cancel` specifies what to do
	server.delete(RouteLookup.API + RouteLookup.Transaction + RouteLookup.TransactionIdParameter, routeController.closeTransaction);
	// Remove a product from a transaction
	server.delete(RouteLookup.API + RouteLookup.Transaction + RouteLookup.TransactionIdParameter + RouteLookup.ProductIdParameter, routeController.removeProduct);
};
