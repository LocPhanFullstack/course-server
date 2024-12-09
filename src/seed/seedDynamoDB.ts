import {
  DeleteTableCommand,
  DynamoDBClient,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";
import * as dynamoose from "dynamoose";
import Transaction from "../models/transactionModel";
import UserCourseProgress from "../models/userCourseProgressModel";
import Course from "../models/courseModel";
import fs from "fs";
import pluralize from "pluralize";
import path from "path";

dotenv.config();
let client: DynamoDBClient;

// DynamoDB Configuration
const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dynamoose.aws.ddb.local();
  client = new DynamoDBClient({
    endpoint: "http://localhost:8000",
    region: "ap-southeast-1",
    credentials: {
      accessKeyId: "dummyKey",
      secretAccessKey: "dummyKey123",
    },
  });
} else {
  client = new DynamoDBClient({
    region: process.env.AWS_REGION || "ap-southeast-1",
  });
}

// DynamoDB Suppress Tag Warnings
const originalWarn = console.warn.bind(console);
console.warn = (message, ...args) => {
  if (
    !message.includes("Tagging is not currently supported in DynamoDB local")
  ) {
    originalWarn(message, ...args);
  }
};

const createTables = async () => {
  const models = [Transaction, UserCourseProgress, Course];

  for (const model of models) {
    const tableName = model.name;
    const table = new dynamoose.Table(tableName, [model], {
      create: true,
      update: true,
      waitForActive: true,
      throughput: { read: 5, write: 5 },
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await table.initialize();
      console.log(`Table created and initialized: ${tableName}`);
    } catch (error: any) {
      console.error(
        `Error creating table ${tableName}: `,
        error.message,
        error.stack
      );
    }
  }
};

const seedData = async (tableName: string, filePath: string) => {
  const data: { [key: string]: any }[] = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  const formattedTableName = pluralize.singular(
    tableName.charAt(0).toUpperCase() + tableName.slice(1)
  );

  console.log(`Seeding data to table: ${formattedTableName}`);

  for (const item of data) {
    try {
      await dynamoose.model(formattedTableName).create(item);
    } catch (error) {
      console.error(
        `Unable to add item to ${formattedTableName}. Error: `,
        JSON.stringify(error, null, 2)
      );
    }
  }

  console.log(
    "\x1b[32m%s\x1b[0m",
    `Successfully seeded data to table: ${formattedTableName}`
  );
};

const deleteTable = async (baseTableName: string) => {
  let deleteCommand = new DeleteTableCommand({ TableName: baseTableName });

  try {
    await client.send(deleteCommand);
    console.log(`Table deleted: ${baseTableName}`);
  } catch (error: any) {
    if (error.name === "ResourceNotFoundException") {
      console.log(`Table does not exist: ${baseTableName}`);
    } else {
      console.error(`Error deleting table ${baseTableName}: `, error);
    }
  }
};

const deleteAllTables = async () => {
  const listTablesCommand = new ListTablesCommand({});
  const { TableNames } = await client.send(listTablesCommand);

  if (TableNames && TableNames.length > 0) {
    for (const tableName of TableNames) {
      await deleteTable(tableName);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }
};

const seed = async () => {
  await deleteAllTables();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await createTables();

  const seedDataPath = path.join(__dirname, "./data");
  const files = fs
    .readdirSync(seedDataPath)
    .filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const tableName = path.basename(file, ".json");
    const filePath = path.join(seedDataPath, file);
    await seedData(tableName, filePath);
  }
};

if (require.main === module) {
  seed().catch((error) => {
    console.error("Failed to run seed script: ", error);
  });
}

export default seed;
