const mongoose = require("mongoose");
require("dotenv").config();
const fs = require('fs');
const { Buffer } = require('buffer');

async function main() {
  /**--------------- Not allowed to be edited - start - --------------------- */
  const mongoUri = process.env.MONGODB_URI;
  const collection = process.env.MONGODB_COLLECTION;

  const args = process.argv.slice(2);

  const command = args[0];
  /**--------------- Not allowed to be edited - end - --------------------- */

  // Connect to MongoDB
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Define a schema for the collection
  const schema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    gendre: {
      type: [String],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    director: {
      type: String,
      required: true
    },
    cast: {
      type: [String],
      required: true
    },
  }, { strict: false });
  const Model = mongoose.model(collection, schema);

  switch (command) {
    case "check-db-connection":
      await checkConnection();
      break;
    // TODO: Buat logic fungsionalitas yg belum tersedia di bawah
    case "bulk-insert" :
      await insertAllMovies(Model);
      break;
    case "reset-db" :
      await deleteAllMovies(Model);
      break;
    default:
      throw Error("command not found");
  }

  await mongoose.disconnect();
  return;
}

async function checkConnection() {
  console.log("check db connection started...");
  try {
    await mongoose.connection.db.admin().ping();
    console.log("MongoDB connection is successful!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
  console.log("check db connection ended...");
}


async function insertAllMovies(model) {
  let seed = fs.readFileSync('seed.json');
  seed = Buffer.from(seed);
  seed = seed.toString();
  seed = JSON.parse(seed);
  await model.insertMany(seed);
  console.log('successfully insert all movies');
}

async function deleteAllMovies(model) {
  await model.deleteMany();
  console.log('successfully delete all movies');
}

main();
