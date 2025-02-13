// store.js - Singleton In-Memory Store
import { randomUUID } from "crypto";

class Store {
  static store = {};
  static currentId = randomUUID();

  static processReceipt(receipt) {
    const id = this.currentId;
    this.store[id] = receipt;
    const result = { id: id };
    this.currentId = randomUUID();
    return result;
  }

  static getReceipt(id) {
    return this.store[id];
  }
}

export default Store;
