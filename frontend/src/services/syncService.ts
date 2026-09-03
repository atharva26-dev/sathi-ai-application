// SAATHI - Offline Sync Service

export interface QueuedAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

const SYNC_QUEUE_KEY = 'pending_sync_queue';

export const syncService = {
  getQueue(): QueuedAction[] {
    try {
      const raw = localStorage.getItem(SYNC_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  enqueue(type: string, payload: any): QueuedAction {
    const action: QueuedAction = {
      id: 'act_' + Math.random().toString(36).substr(2, 9),
      type,
      payload,
      timestamp: Date.now()
    };
    const queue = this.getQueue();
    queue.push(action);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    return action;
  },

  clearQueue(): void {
    localStorage.removeItem(SYNC_QUEUE_KEY);
  },

  async processQueue(): Promise<{ success: boolean; count: number }> {
    const queue = this.getQueue();
    if (queue.length === 0) return { success: true, count: 0 };

    // Simulate syncing actions to future backend API endpoint
    await new Promise((resolve) => setTimeout(resolve, 800));
    this.clearQueue();
    return { success: true, count: queue.length };
  }
};
