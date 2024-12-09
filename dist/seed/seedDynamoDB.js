"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const dotenv_1 = __importDefault(require("dotenv"));
const dynamoose = __importStar(require("dynamoose"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const userCourseProgressModel_1 = __importDefault(require("../models/userCourseProgressModel"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
const fs_1 = __importDefault(require("fs"));
const pluralize_1 = __importDefault(require("pluralize"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
let client;
// DynamoDB Configuration
const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
    dynamoose.aws.ddb.local();
    client = new client_dynamodb_1.DynamoDBClient({
        endpoint: "http://localhost:8000",
        region: "ap-southeast-1",
        credentials: {
            accessKeyId: "dummyKey",
            secretAccessKey: "dummyKey123",
        },
    });
}
else {
    client = new client_dynamodb_1.DynamoDBClient({
        region: process.env.AWS_REGION || "ap-southeast-1",
    });
}
// DynamoDB Suppress Tag Warnings
const originalWarn = console.warn.bind(console);
console.warn = (message, ...args) => {
    if (!message.includes("Tagging is not currently supported in DynamoDB local")) {
        originalWarn(message, ...args);
    }
};
const createTables = () => __awaiter(void 0, void 0, void 0, function* () {
    const models = [transactionModel_1.default, userCourseProgressModel_1.default, courseModel_1.default];
    for (const model of models) {
        const tableName = model.name;
        const table = new dynamoose.Table(tableName, [model], {
            create: true,
            update: true,
            waitForActive: true,
            throughput: { read: 5, write: 5 },
        });
        try {
            yield new Promise((resolve) => setTimeout(resolve, 2000));
            yield table.initialize();
            console.log(`Table created and initialized: ${tableName}`);
        }
        catch (error) {
            console.error(`Error creating table ${tableName}: `, error.message, error.stack);
        }
    }
});
const seedData = (tableName, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
    const formattedTableName = pluralize_1.default.singular(tableName.charAt(0).toUpperCase() + tableName.slice(1));
    console.log(`Seeding data to table: ${formattedTableName}`);
    for (const item of data) {
        try {
            yield dynamoose.model(formattedTableName).create(item);
        }
        catch (error) {
            console.error(`Unable to add item to ${formattedTableName}. Error: `, JSON.stringify(error, null, 2));
        }
    }
    console.log("\x1b[32m%s\x1b[0m", `Successfully seeded data to table: ${formattedTableName}`);
});
const deleteTable = (baseTableName) => __awaiter(void 0, void 0, void 0, function* () {
    let deleteCommand = new client_dynamodb_1.DeleteTableCommand({ TableName: baseTableName });
    try {
        yield client.send(deleteCommand);
        console.log(`Table deleted: ${baseTableName}`);
    }
    catch (error) {
        if (error.name === "ResourceNotFoundException") {
            console.log(`Table does not exist: ${baseTableName}`);
        }
        else {
            console.error(`Error deleting table ${baseTableName}: `, error);
        }
    }
});
const deleteAllTables = () => __awaiter(void 0, void 0, void 0, function* () {
    const listTablesCommand = new client_dynamodb_1.ListTablesCommand({});
    const { TableNames } = yield client.send(listTablesCommand);
    if (TableNames && TableNames.length > 0) {
        for (const tableName of TableNames) {
            yield deleteTable(tableName);
            yield new Promise((resolve) => setTimeout(resolve, 800));
        }
    }
});
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    yield deleteAllTables();
    yield new Promise((resolve) => setTimeout(resolve, 1000));
    yield createTables();
    const seedDataPath = path_1.default.join(__dirname, "./data");
    const files = fs_1.default
        .readdirSync(seedDataPath)
        .filter((file) => file.endsWith(".json"));
    for (const file of files) {
        const tableName = path_1.default.basename(file, ".json");
        const filePath = path_1.default.join(seedDataPath, file);
        yield seedData(tableName, filePath);
    }
});
if (require.main === module) {
    seed().catch((error) => {
        console.error("Failed to run seed script: ", error);
    });
}
exports.default = seed;
