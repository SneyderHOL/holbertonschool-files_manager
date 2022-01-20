import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const unauthorizedResponse = { error: 'Unauthorized' };

class AuthController {
  // user sign-in
  static async getConnect(request, response) {
    const Authorization = request.header('Authorization') || '';
    const encoding = 'base64';
    const format = 'utf-8';
    const credentials = Authorization.split(' ')[1];

    if (!credentials) {
      return response.status(401).send(unauthorizedResponse);
    }

    const decodedCredentials = Buffer.from(credentials, encoding).toString(format);
    const [email, password] = decodedCredentials.split(':');

    if (!email || !password) {
      return response.status(401).send(unauthorizedResponse);
    }

    const hashedPassword = sha1(password);
    const user = await dbClient.usersCollection.findOne({
      email,
      password: hashedPassword,
    });

    if (!user) {
      return response.status(401).send(unauthorizedResponse);
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    const tokenTTL = 24 * 3600;

    await redisClient.set(key, user._id.toString(), tokenTTL);

    return response.status(200).send({ token });
  }

  // user sign-out
  static async getDisconnect(request, response) {
    const token = request.headers['x-token'];
    const key = `auth_${token}`;

    const userId = await redisClient.get(key);

    if (!userId) {
      return response.status(401).send(unauthorizedResponse);
    }

    await redisClient.del(key);

    return response.status(204).send();
  }
}

export default AuthController;
