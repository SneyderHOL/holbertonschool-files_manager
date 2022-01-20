import { MongoClient } from 'mongodb';
import { env } from 'process';

const host = env.DB_HOST || 'localhost';
const port = env.DB_PORT || 27017;
const database = env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}`;

class DBClient {
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        this.db = client.db(database);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      } else {
        console.log(err.message);
        this.db = false;
      }
    });
  }

  // Returns true when the connection to Mongo is a success otherwise, false
  isAlive() {
    return !!this.db;
  }

  // Returns the number of documents in the users collection
  async nbUsers() {
    const numberOfUsers = this.usersCollection.countDocuments();
    return numberOfUsers;
  }

  // Returns the number of documents in the files collection
  async nbFiles() {
    const numberOfFiles = this.filesCollection.countDocuments();
    return numberOfFiles;
  }
}

const dbClient = new DBClient();

export default dbClient;
