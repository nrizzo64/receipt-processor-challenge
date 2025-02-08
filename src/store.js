// store.js - Singleton In-Memory Store
import { randomUUID } from 'crypto';

class Store {
  static store = {};
  static currentId = randomUUID();

  static processReceipt(receipt) {
    const processedReceipt = {
      [this.currentId]: {
        retailer: "Target",
        purchaseDate: "2022-01-02",
        purchaseTime: "13:13",
        total: "1.25",
        items: [{ shortDescription: "Pepsi - 12-oz", price: "1.25" }],
      },
    };
    this.store = { ...this.store, ...processedReceipt };
    this.currentId = randomUUID();
    
    return { "id": this.currentId}
  }
}

export default Store;
