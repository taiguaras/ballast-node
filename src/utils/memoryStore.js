/**
 * Simple in-memory data store to use as fallback when database is not available
 */
class MemoryStore {
  constructor() {
    this.users = new Map();
    this.indications = new Map();
    this.sequences = {
      users: 1,
      indications: 1
    };
  }

  // User methods
  async createUser(userData) {
    const id = `user_${this.sequences.users++}`;
    const timestamp = new Date();
    const user = {
      id,
      ...userData,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.users.set(id, user);
    return user;
  }

  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async getUser(id) {
    return this.users.get(id) || null;
  }

  // Indication methods
  async createIndication(data) {
    const id = `ind_${this.sequences.indications++}`;
    const timestamp = new Date();
    const indication = {
      id,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.indications.set(id, indication);
    return indication;
  }

  async getIndication(id) {
    return this.indications.get(id) || null;
  }

  async getAllIndications(options = {}) {
    const { page = 1, limit = 10, category, status } = options;
    
    // Filter indications
    let filtered = Array.from(this.indications.values());
    
    if (category) {
      filtered = filtered.filter(ind => ind.category === category);
    }
    
    if (status) {
      filtered = filtered.filter(ind => ind.status === status);
    }
    
    // Calculate pagination
    const start = (page - 1) * limit;
    const end = start + Number(limit);
    const paginatedIndications = filtered.slice(start, end);
    
    return {
      rows: paginatedIndications,
      count: filtered.length
    };
  }

  async updateIndication(id, data) {
    const indication = this.indications.get(id);
    if (!indication) return null;
    
    const updated = {
      ...indication,
      ...data,
      updatedAt: new Date()
    };
    
    this.indications.set(id, updated);
    return updated;
  }

  async deleteIndication(id) {
    const indication = this.indications.get(id);
    if (!indication) return false;
    
    this.indications.delete(id);
    return true;
  }
}

// Singleton instance
const memoryStore = new MemoryStore();

module.exports = memoryStore; 