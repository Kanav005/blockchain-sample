"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SHA256 = require('crypto-js/sha256');
var Block = /** @class */ (function () {
    // Initialize the block
    function Block(block_id, data, prev_hash) {
        if (block_id === void 0) { block_id = 0; }
        if (prev_hash === void 0) { prev_hash = ""; }
        this.block_id = block_id;
        this.timestamp = new Date();
        this.nonce = Math.floor(Math.random() * 131072 + 1);
        this.data = data;
        this.prev_hash = prev_hash;
        this.hash = this.computeHash().toString();
    }
    Block.prototype.computeHash = function () {
        return SHA256((this.block_id + this.timestamp.toString() + this.nonce + JSON.stringify(this.data) + this.prev_hash).toString());
    };
    return Block;
}());
var BlockChain = /** @class */ (function () {
    function BlockChain() {
        this.chain = [new Block(0, "This is the genesis block", "0")];
    }
    BlockChain.prototype.getLastBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    BlockChain.prototype.addBlock = function (block) {
        block.block_id = this.getLastBlock().block_id + 1;
        block.prev_hash = this.getLastBlock().hash;
        block.hash = block.computeHash().toString();
        this.chain.push(block);
    };
    return BlockChain;
}());
var MTChain = new BlockChain();
// similar to set function during API calls
function CreateNewBlock(transaction) {
    return new Block(0, transaction);
}
function JoinBlockToNode(block) {
    MTChain.addBlock(block);
    return MTChain;
}
var transaction_1 = "Ram -> Shyam : 50\nShyam -> Sita : 30\nShyam -> Ram : 20\nSita -> Ram : 40\n";
var transaction_2 = "Avi -> Chokshi : 50\nChokshi -> Meet : 70\nMeet -> Gaurav : 20\nAvi -> Gaurav : 10\n";
var transaction_3 = "Chokshi -> Mehta : 70\nMeet -> Chokshi : 30\nMeet -> Mehta : 50\n";
var block1 = new Block(0, transaction_1);
var block2 = new Block(0, transaction_2);
var block3 = new Block(0, transaction_3);
var mal_node = new Block(0, "Malicious node");
var block4 = new Block(0, "This is a new block 4");
var block5 = new Block(0, "The amazing spider man 2");
// console.log(block2)
// console.log(block3)
MTChain.addBlock(block1);
MTChain.addBlock(block2);
MTChain.addBlock(block3);
mal_node.prev_hash = MTChain.chain[MTChain.chain.length - 1].hash;
MTChain.addBlock(mal_node);
MTChain.addBlock(block4);
MTChain.addBlock(block5);
// block3.hash = '4e41f10a4b1d78565bb7056094e192bca07026d76b5f7e7449d0e89493056f86'
console.log(MTChain);
// Checking replay attacks
for (var i = 0; i < MTChain.chain.length; i++) {
    if (i > 0 && MTChain.chain[i].prev_hash != MTChain.chain[i - 1].hash) {
        console.log("MALICIOUS BLOCK : " + i + " IN BLOCKCHAIN!");
    }
}
for (var i = 0; i < MTChain.chain.length; i++) {
    var hash_of_block = String(SHA256((MTChain.chain[i].block_id + MTChain.chain[i].timestamp.toString() + MTChain.chain[i].nonce + JSON.stringify(MTChain.chain[i].data) + MTChain.chain[i].prev_hash).toString()));
    if (hash_of_block != MTChain.chain[i].hash) {
        console.log("MALICIOUS BLOCK AT BLOCK NO : " + MTChain.chain[i].block_id);
        break;
    }
}
