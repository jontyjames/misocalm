/**
 * Quiz Lead Service
 * Saves quiz results and email to quiz_leads table
 */

import { db } from './supabase';

export const quizService = {
  /**
   * Save a quiz lead (email + results)
   * @param {Object} lead
   * @param {string} lead.email
   * @param {string} lead.result_category
   * @param {number} lead.total_score
   * @param {number[]} lead.answers
   * @param {string} [lead.referrer]
   * @param {string} [lead.utm_source]
   * @param {string} [lead.utm_medium]
   * @param {string} [lead.utm_campaign]
   */
  async saveLead(lead) {
    return db.insert('quiz_leads', {
      email: lead.email,
      result_category: lead.result_category,
      total_score: lead.total_score,
      answers: lead.answers,
      referrer: lead.referrer || null,
      utm_source: lead.utm_source || null,
      utm_medium: lead.utm_medium || null,
      utm_campaign: lead.utm_campaign || null,
    });
  },
};
