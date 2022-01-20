import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

function routes(app) {
  const router = express.Router();
  app.use('/', router);

  // route to get status connection on redis and mongo
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // route to get the number of users and files in mongo database
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  // route to create a new user in DB
  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  // route to sign-in the user
  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  // route to sign-out the user
  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  // route to get the user
  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });
}

export default routes;
