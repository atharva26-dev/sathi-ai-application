import { getActionableRoadmapTasks, getExpansionRoadmapWithSafetyGates } from '../domain/roadmap/actionRoadmapEngine.js';

let localTasksCache = getActionableRoadmapTasks();

export const mentorService = {
  getTasks: async (userId?: string) => {
    return localTasksCache;
  },

  toggleTaskStatus: async (taskId: string, isCompleted: boolean) => {
    localTasksCache = localTasksCache.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          status: isCompleted ? 'completed' : 'pending'
        };
      }
      return task;
    });

    return localTasksCache;
  },

  getExpansionRoadmap: async () => {
    return getExpansionRoadmapWithSafetyGates();
  }
};
