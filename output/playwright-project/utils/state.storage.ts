import fs from 'fs';
import path from 'path';

/**
 * Persistent state storage for multi-user Playwright tests.
 * Stores login sessions, workstream IDs, and collaboration data across test runs.
 *
 * Usage:
 *   const storage = new StateStorage();
 *   storage.saveUserSession('maruthi', { email, token, workstreamId });
 *   const session = storage.getUserSession('nazia');
 */

interface UserSession {
  email: string;
  password?: string;
  token?: string;
  workstreamId?: string;
  collaborators?: string[];
  timestamp?: number;
}

interface StorageData {
  [userName: string]: UserSession;
}

export class StateStorage {
  private storagePath: string;
  private data: StorageData = {};

  constructor(filename: string = '.state-storage.json') {
    this.storagePath = path.join(process.cwd(), filename);
    this.loadFromDisk();
  }

  /**
   * Load storage data from disk.
   */
  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.storagePath)) {
        const content = fs.readFileSync(this.storagePath, 'utf-8');
        this.data = JSON.parse(content);
      }
    } catch (error) {
      console.warn(`Could not load state storage from ${this.storagePath}:`, error);
      this.data = {};
    }
  }

  /**
   * Save storage data to disk.
   */
  private saveToDisk(): void {
    try {
      fs.writeFileSync(this.storagePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Could not save state storage to ${this.storagePath}:`, error);
    }
  }

  /**
   * Save a user session (email, token, workstream ID, etc.).
   */
  saveUserSession(userName: string, session: UserSession): void {
    this.data[userName] = {
      ...this.data[userName],
      ...session,
      timestamp: Date.now(),
    };
    this.saveToDisk();
  }

  /**
   * Get a user session by name.
   */
  getUserSession(userName: string): UserSession | null {
    return this.data[userName] || null;
  }

  /**
   * Save workstream ID for a user.
   */
  saveWorkstreamId(userName: string, workstreamId: string): void {
    if (!this.data[userName]) {
      this.data[userName] = {};
    }
    this.data[userName].workstreamId = workstreamId;
    this.saveToDisk();
  }

  /**
   * Get workstream ID for a user.
   */
  getWorkstreamId(userName: string): string | undefined {
    return this.data[userName]?.workstreamId;
  }

  /**
   * Add a collaborator to a user's list.
   */
  addCollaborator(userName: string, collaboratorName: string): void {
    if (!this.data[userName]) {
      this.data[userName] = {};
    }
    if (!this.data[userName].collaborators) {
      this.data[userName].collaborators = [];
    }
    if (!this.data[userName].collaborators!.includes(collaboratorName)) {
      this.data[userName].collaborators!.push(collaboratorName);
    }
    this.saveToDisk();
  }

  /**
   * Get collaborators for a user.
   */
  getCollaborators(userName: string): string[] {
    return this.data[userName]?.collaborators || [];
  }

  /**
   * Clear all stored data.
   */
  clear(): void {
    this.data = {};
    this.saveToDisk();
  }

  /**
   * Clear data for a specific user.
   */
  clearUser(userName: string): void {
    delete this.data[userName];
    this.saveToDisk();
  }

  /**
   * Get all stored user names.
   */
  getAllUsers(): string[] {
    return Object.keys(this.data);
  }

  /**
   * Get all stored data (for debugging).
   */
  getAllData(): StorageData {
    return { ...this.data };
  }
}

// Export singleton instance
export const stateStorage = new StateStorage();
