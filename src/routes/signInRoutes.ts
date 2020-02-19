import express from 'express';
import { RouteLookup } from '../controllers/lookups/routingLookup';
import * as SignInRouteController from '../controllers/signInRouteController';

function signInRoutes(server: express.Express) {
	server.get('/', SignInRouteController.getView);

	// Sign in
	server.post(RouteLookup.SignIn, SignInRouteController.signIn);

	// Sign out
	server.delete(RouteLookup.API + RouteLookup.SignOut, SignInRouteController.clearActiveUser);
}

module.exports.routes = signInRoutes;
