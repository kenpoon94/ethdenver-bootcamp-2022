"use strict";
exports.__esModule = true;
exports.tokenizedContract = exports.tokenContract = exports.getSigner = exports.convertToBytes32Array = void 0;
var ethers_1 = require("ethers");
var MyToken_json_1 = require("../assets/MyToken.json");
var TokenizedBallot_json_1 = require("../assets/TokenizedBallot.json");
var tokenizedBallotAddress = '0x79445Cd7183D958290fA104d4329D5B568E5D290';
var myTokenAddress = '0xbed29Fae97B77B94ba96D403Ded28987448359dc';
var dotenv = require("dotenv");
dotenv.config({ path: '../.env' });
var convertToBytes32Array = function (array) {
    var bytes32Array = array.map(function (x) {
        return ethers_1.ethers.utils.formatBytes32String(x);
    });
    return bytes32Array;
};
exports.convertToBytes32Array = convertToBytes32Array;
var getSigner = function (accountPath) {
    var _a;
    if (accountPath === void 0) { accountPath = process.env.META_1; }
    var provider = ethers_1.ethers.getDefaultProvider('goerli', {
        etherscan: process.env.ETHERSCAN_API_KEY,
        alchemy: process.env.ALCHEMY_API_KEY
    });
    var wallet = ethers_1.ethers.Wallet.fromMnemonic((_a = process.env.MNEMONIC) !== null && _a !== void 0 ? _a : '', accountPath !== null && accountPath !== void 0 ? accountPath : '');
    return wallet.connect(provider);
};
exports.getSigner = getSigner;
exports.tokenContract = new ethers_1.ethers.ContractFactory(MyToken_json_1["default"].abi, MyToken_json_1["default"].bytecode).attach(myTokenAddress);
exports.tokenizedContract = new ethers_1.ethers.ContractFactory(TokenizedBallot_json_1["default"].abi, TokenizedBallot_json_1["default"].bytecode).attach(tokenizedBallotAddress);
