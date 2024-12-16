"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const __1 = require("..");
const updateUser = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield __1.clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                settings: userData.publicMetadata.settings,
            },
        });
    }
    catch (error) {
        throw new Error(`Error updating user metadata: ${error.message}`);
    }
});
exports.updateUser = updateUser;
