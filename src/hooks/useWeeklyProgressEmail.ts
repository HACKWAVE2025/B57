import { useEffect, useCallback } from "react";
import { n8nIntegrationService } from "../utils/n8nIntegrationService";
import { realTimeAuth } from "../utils/realTimeAuth";

/**
 * Hook to automatically send weekly progress emails
 * Checks every day if it's Monday and sends the email
 */
export const useWeeklyProgressEmail = () => {
  const sendWeeklyEmail = useCallback(async () => {
    const user = realTimeAuth.getCurrentUser();
    if (!user) {
      console.log("No user authenticated, skipping weekly email");
      return;
    }

    // Check if today is Monday (day 1)
    const today = new Date();
    const dayOfWeek = today.getDay();

    // Send email on Mondays at 9 AM (or whenever the user opens the app on Monday)
    // You can also check for a specific time if needed
    if (dayOfWeek === 1) {
      // Check if we already sent this week's email
      const lastEmailSent = localStorage.getItem(`weekly_email_sent_${user.id}_${today.getFullYear()}_W${getWeekNumber(today)}`);
      
      if (!lastEmailSent) {
        console.log("🔄 Sending weekly progress email...");
        const success = await n8nIntegrationService.sendWeeklyProgressToN8N(user.id);
        
        if (success) {
          // Mark as sent for this week
          localStorage.setItem(`weekly_email_sent_${user.id}_${today.getFullYear()}_W${getWeekNumber(today)}`, "true");
          console.log("✅ Weekly progress email sent successfully");
        } else {
          console.error("❌ Failed to send weekly progress email");
        }
      }
    }
  }, []);

  // Check on mount and set up daily check
  useEffect(() => {
    sendWeeklyEmail();

    // Check every hour if it's Monday and we haven't sent yet
    const interval = setInterval(() => {
      sendWeeklyEmail();
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [sendWeeklyEmail]);

  // Manual trigger function
  const triggerNow = useCallback(async () => {
    const user = realTimeAuth.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    return await n8nIntegrationService.sendWeeklyProgressToN8N(user.id);
  }, []);

  return {
    sendWeeklyEmail: triggerNow,
  };
};

/**
 * Get week number for the year
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + (4 - dayNum));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

