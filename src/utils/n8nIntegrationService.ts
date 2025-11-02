import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestoreTasks } from "./firestoreTasks";
import { firestoreUserTasks } from "./firestoreUserTasks";
import { StreakTracker, StreakData } from "./streakTracker";
import { cloudAnalyticsStorage } from "./cloudAnalyticsStorage";
import { realTimeAuth } from "./realTimeAuth";

export interface UserProgressData {
  // User Info
  userId: string;
  email: string;
  username: string;
  
  // Week Information
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  year: number;
  progressPercentage: number;
  
  // Tasks Data
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  tasksThisWeek: number;
  completedTasksThisWeek: number;
  highPriorityTasks: number;
  
  // Streak Data
  currentStreak: number;
  longestStreak: number;
  tasksCompletedToday: number;
  totalTasksCompleted: number;
  weeklyGoal: number;
  tasksCompletedThisWeek: number;
  
  // Interview Analytics
  totalInterviews: number;
  interviewsThisWeek: number;
  averageScore: number;
  recentInterviewScore?: number;
  improvementTrend: "improving" | "stable" | "declining";
  
  // Teams Data
  teamCount: number;
  
  // Study Sessions
  studySessionsThisWeek?: number;
  
  // Achievement Data
  achievementsUnlocked: number;
  recentAchievements: string[];
}

export interface N8NWebhookPayload {
  user: UserProgressData;
  timestamp: string;
}

class N8NIntegrationService {
  private readonly WEBHOOK_URL = "https://akshayjuluri.app.n8n.cloud/webhook/qhUVlmQv0SFYAMrz";

  /**
   * Calculate week information
   */
  private calculateWeekInfo() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const daysSinceStart = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    return {
      weekNumber,
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      year: now.getFullYear(),
      progressPercentage: Math.round((weekNumber / 52) * 100),
    };
  }

  /**
   * Get user tasks data
   */
  private async getUserTasksData(userId: string) {
    try {
      // Try both task services to ensure we get all tasks
      let allTasks: any[] = [];
      
      try {
        // Try firestoreUserTasks first (users/{userId}/tasks collection)
        const userTasks = await firestoreUserTasks.getTasks(userId);
        console.log(`📋 Found ${userTasks.length} tasks from firestoreUserTasks`);
        allTasks = userTasks;
      } catch (error) {
        console.warn("Error getting tasks from firestoreUserTasks:", error);
      }
      
      // If no tasks found, try firestoreTasks (tasks collection)
      if (allTasks.length === 0) {
        try {
          const collectionTasks = await firestoreTasks.getTasks(userId);
          console.log(`📋 Found ${collectionTasks.length} tasks from firestoreTasks`);
          allTasks = collectionTasks;
        } catch (error) {
          console.warn("Error getting tasks from firestoreTasks:", error);
        }
      }
      
      console.log(`✅ Total tasks found: ${allTasks.length} for user ${userId}`);
      
      if (allTasks.length === 0) {
        console.warn("⚠️ No tasks found - this might indicate a data issue");
      }
      
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekStartTime = weekStart.getTime();
      
      // Calculate week end time
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const weekEndTime = weekEnd.getTime();
      
      const completedTasks = allTasks.filter(task => task.status === "completed");
      const pendingTasks = allTasks.filter(task => task.status === "pending");
      const highPriorityTasks = allTasks.filter(task => task.priority === "high");
      
      // Tasks created this week
      const tasksCreatedThisWeek = allTasks.filter(task => {
        const taskDate = new Date(task.createdAt).getTime();
        return taskDate >= weekStartTime && taskDate <= weekEndTime;
      });
      
      // Tasks completed this week
      // Since Task interface doesn't have completion date, we count:
      // 1. Completed tasks that were created this week (likely completed this week)
      // 2. For better accuracy, we assume completed tasks created this week were completed this week
      const completedTasksThisWeek = completedTasks.filter(task => {
        const taskCreatedDate = new Date(task.createdAt).getTime();
        // Include completed tasks created this week
        // This is the best approximation we can do without completion date tracking
        return taskCreatedDate >= weekStartTime && taskCreatedDate <= weekEndTime;
      });
      
      return {
        totalTasks: allTasks.length,
        completedTasks: completedTasks.length,
        pendingTasks: pendingTasks.length,
        tasksThisWeek: tasksCreatedThisWeek.length,
        completedTasksThisWeek: completedTasksThisWeek.length,
        highPriorityTasks: highPriorityTasks.length,
      };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        tasksThisWeek: 0,
        completedTasksThisWeek: 0,
        highPriorityTasks: 0,
      };
    }
  }

  /**
   * Get streak data
   */
  private getStreakData(userId: string): StreakData {
    return StreakTracker.getStreakData(userId);
  }

  /**
   * Get interview analytics data
   */
  private async getInterviewAnalytics(userId: string) {
    try {
      const performanceHistory = await cloudAnalyticsStorage.getPerformanceHistory(userId);
      
      if (performanceHistory.length === 0) {
        return {
          totalInterviews: 0,
          interviewsThisWeek: 0,
          averageScore: 0,
          improvementTrend: "stable" as const,
        };
      }
      
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const interviewsThisWeek = performanceHistory.filter(interview => {
        const interviewDate = new Date(interview.timestamp);
        return interviewDate >= weekStart;
      });
      
      const totalScore = performanceHistory.reduce((sum, interview) => sum + interview.overallScore, 0);
      const averageScore = Math.round(totalScore / performanceHistory.length);
      
      // Get recent interview score
      const recentInterview = performanceHistory[0];
      const recentInterviewScore = recentInterview?.overallScore;
      
      // Determine improvement trend (compare last 3 interviews)
      let improvementTrend: "improving" | "stable" | "declining" = "stable";
      if (performanceHistory.length >= 3) {
        const lastThree = performanceHistory.slice(0, 3);
        const recentAvg = (lastThree[0].overallScore + lastThree[1].overallScore) / 2;
        const olderAvg = (lastThree[1].overallScore + lastThree[2].overallScore) / 2;
        
        if (recentAvg > olderAvg + 5) {
          improvementTrend = "improving";
        } else if (recentAvg < olderAvg - 5) {
          improvementTrend = "declining";
        }
      }
      
      return {
        totalInterviews: performanceHistory.length,
        interviewsThisWeek: interviewsThisWeek.length,
        averageScore,
        recentInterviewScore,
        improvementTrend,
      };
    } catch (error) {
      console.error("Error fetching interview analytics:", error);
      return {
        totalInterviews: 0,
        interviewsThisWeek: 0,
        averageScore: 0,
        improvementTrend: "stable" as const,
      };
    }
  }

  /**
   * Get team count
   */
  private async getTeamCount(userId: string) {
    try {
      const teamsQuery = query(
        collection(db, "teams"),
        where(`members.${userId}`, "!=", null)
      );
      const teamsSnapshot = await getDocs(teamsQuery);
      return teamsSnapshot.size;
    } catch (error) {
      console.error("Error fetching teams:", error);
      return 0;
    }
  }

  /**
   * Get achievements data
   */
  private getAchievementsData(userId: string) {
    try {
      const achievements = StreakTracker.getAchievements(userId);
      const unlocked = achievements.filter(a => a.unlocked);
      const recentUnlocked = unlocked
        .filter(a => {
          if (!a.unlockedAt) return false;
          const unlockedDate = new Date(a.unlockedAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return unlockedDate >= weekAgo;
        })
        .map(a => a.title)
        .slice(0, 5);
      
      return {
        achievementsUnlocked: unlocked.length,
        recentAchievements: recentUnlocked,
      };
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return {
        achievementsUnlocked: 0,
        recentAchievements: [],
      };
    }
  }

  /**
   * Collect all user progress data
   */
  async collectUserProgressData(userId: string): Promise<UserProgressData | null> {
    try {
      const user = realTimeAuth.getCurrentUser();
      if (!user || user.id !== userId) {
        console.error("User not authenticated or user ID mismatch");
        return null;
      }

      console.log("📊 Collecting user progress data for:", userId);

      const weekInfo = this.calculateWeekInfo();
      console.log("📅 Week info:", weekInfo);

      const tasksData = await this.getUserTasksData(userId);
      console.log("✅ Tasks data:", tasksData);

      const streakData = this.getStreakData(userId);
      console.log("🔥 Streak data:", streakData);

      const interviewData = await this.getInterviewAnalytics(userId);
      console.log("🎯 Interview data:", interviewData);

      const teamCount = await this.getTeamCount(userId);
      console.log("👥 Team count:", teamCount);

      const achievementsData = this.getAchievementsData(userId);
      console.log("🏆 Achievements data:", achievementsData);

      const progressData: UserProgressData = {
        userId: user.id,
        email: user.email || "",
        username: user.username || "User",
        ...weekInfo,
        ...tasksData,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        tasksCompletedToday: streakData.tasksCompletedToday,
        totalTasksCompleted: streakData.totalTasksCompleted,
        weeklyGoal: streakData.weeklyGoal,
        // FIXED: Use actual Firestore data instead of localStorage for accuracy
        tasksCompletedThisWeek: tasksData.completedTasksThisWeek,
        ...interviewData,
        teamCount,
        ...achievementsData,
      };

      console.log("📦 Final progress data being sent:", JSON.stringify(progressData, null, 2));
      return progressData;
    } catch (error) {
      console.error("Error collecting user progress data:", error);
      return null;
    }
  }

  /**
   * Send user progress data to n8n webhook
   */
  async sendWeeklyProgressToN8N(userId: string): Promise<boolean> {
    try {
      const progressData = await this.collectUserProgressData(userId);
      
      if (!progressData) {
        console.error("❌ Failed to collect progress data");
        return false;
      }

      console.log("📤 Sending to n8n webhook:", this.WEBHOOK_URL);
      console.log("📦 Payload structure:", {
        hasUser: !!progressData,
        userId: progressData.userId,
        totalTasks: progressData.totalTasks,
        completedTasks: progressData.completedTasks,
      });

      const payload: N8NWebhookPayload = {
        user: progressData,
        timestamp: new Date().toISOString(),
      };

      console.log("📨 Full payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(this.WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📬 Response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json().catch(() => ({}));
      console.log("✅ Successfully sent progress data to n8n:", result);
      return true;
    } catch (error) {
      console.error("❌ Error sending data to n8n:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      }
      return false;
    }
  }

  /**
   * Test the webhook connection
   */
  async testWebhook(userId: string): Promise<boolean> {
    try {
      const progressData = await this.collectUserProgressData(userId);
      if (!progressData) return false;

      console.log("📊 Collected progress data:", progressData);
      return await this.sendWeeklyProgressToN8N(userId);
    } catch (error) {
      console.error("❌ Webhook test failed:", error);
      return false;
    }
  }
}

export const n8nIntegrationService = new N8NIntegrationService();

