"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SHA256 = require('crypto-js/sha256');
var Block = /** @class */ (function () {
    // Initialize the block
    function Block(block_id, difficulty, data, prev_hash) {
        if (block_id === void 0) { block_id = 0; }
        if (difficulty === void 0) { difficulty = 0; }
        if (prev_hash === void 0) { prev_hash = ""; }
        this.block_id = block_id;
        this.timestamp = new Date();
        this.nonce = 0;
        this.difficulty = difficulty;
        this.data = data;
        this.prev_hash = prev_hash;
        this.hash = this.computeHash(this).toString();
    }
    Block.prototype.MineBlock = function (difficulty) {
        console.log("⛏️ Mining under process...");
        var guess = SHA256((this.block_id + this.timestamp.toString() + this.nonce + JSON.stringify(this.data) + this.prev_hash).toString()).toString();
        console.log(Array(difficulty).join("0"));
        console.log(guess.toString().substring(0, difficulty - 1));
        while (true) {
            if (guess.toString().substring(0, difficulty) == "0".padStart(difficulty, "0")) {
                break;
            }
            this.nonce++;
            guess = SHA256((this.block_id + this.timestamp.toString() + this.nonce + JSON.stringify(this.data) + this.prev_hash).toString());
        }
        console.log("⛏️ Mining completed!");
        return guess.toString();
    };
    Block.prototype.computeHash = function (block) {
        return SHA256((block.block_id + block.timestamp.toString() + block.nonce + JSON.stringify(block.data) + block.prev_hash).toString());
    };
    return Block;
}());
var BlockChain = /** @class */ (function () {
    function BlockChain() {
        this.chain = [new Block(0, 1, "This is the genesis block", "0")];
    }
    BlockChain.prototype.getLastBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    BlockChain.prototype.addBlock = function (block) {
        console.log("Block ID : " + block.block_id.toString());
        if (block.block_id % 4 == 0) {
            block.difficulty = this.getLastBlock().difficulty + 1;
        }
        block.block_id = this.getLastBlock().block_id + 1;
        block.prev_hash = this.getLastBlock().hash;
        block.hash = block.MineBlock(block.difficulty);
        this.validateBlocks();
        this.chain.push(block);
    };
    BlockChain.prototype.validateBlocks = function () {
        console.log("In validate blocks");
        for (var i = 1; i < this.chain.length - 1; i++) {
            var currentBlock = this.chain[i];
            var previousBlock = this.chain[i - 1];
            if (currentBlock.prev_hash != previousBlock.hash) {
                console.log("🚨Alert! Malicious node detected at block id : " + currentBlock.block_id + " 🚨");
                break;
            }
            if (currentBlock.hash != currentBlock.computeHash(currentBlock)) {
                console.log("🚨Alert! Malicious node detected at block id : " + currentBlock.block_id + " 🚨");
                break;
            }
        }
    };
    return BlockChain;
}());
var MTChain = new BlockChain();
// similar to set function during API calls
// function CreateNewBlock(transaction: string){
//     return new Block(0, transaction)
// }
// function JoinBlockToNode(block: Block){
//     MTChain.addBlock(block)
//     return MTChain
// }
var transaction_1 = "Ram -> Shyam : 50\nShyam -> Sita : 30\nShyam -> Ram : 20\nSita -> Ram : 40\n";
var transaction_2 = "Avi -> Chokshi : 50\nChokshi -> Meet : 70\nMeet -> Gaurav : 20\nAvi -> Gaurav : 10\n";
var transaction_3 = "Chokshi -> Mehta : 70\nMeet -> Chokshi : 30\nMeet -> Mehta : 50\n";
var transaction_4 = "Chokshi -> Mehta : 70\nMeet -> Chokshi : 30\nMeet -> Mehta : 50\n";
var block1 = new Block(0, 0, transaction_1);
var block2 = new Block(0, 0, transaction_2);
var block3 = new Block(0, 0, transaction_3);
var block4 = new Block(0, 0, transaction_3);
// console.log(block2)
// console.log(block3)
MTChain.addBlock(block1);
MTChain.addBlock(block2);
MTChain.addBlock(block3);
MTChain.addBlock(block4);
console.log(MTChain);
// Checking replay attacks
// for(var i=0;i<MTChain.chain.length; i++){
//     if( i > 0 && MTChain.chain[i].prev_hash != MTChain.chain[i-1].hash){
//         console.log("MALICIOUS BLOCK : "+i+" IN BLOCKCHAIN!");
//     }
// }
// for(var i=0; i<MTChain.chain.length; i++){
//     let hash_of_block = String(SHA256((MTChain.chain[i].block_id + MTChain.chain[i].timestamp.toString() + MTChain.chain[i].nonce + JSON.stringify(MTChain.chain[i].data) + MTChain.chain[i].prev_hash).toString()));
//     if(hash_of_block != MTChain.chain[i].hash){
//         console.log("MALICIOUS BLOCK AT BLOCK NO : "+MTChain.chain[i].block_id);
//         break;
//     }
// }
