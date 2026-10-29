'use server';

import { db } from '@/lib/db/store';

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  institution?: string;
  message: string;
}

export async function submitContactAction(data: ContactSubmission): Promise<{
  success: boolean;
  ticketId?: string;
  error?: string;
}> {
  try {
    const name = (data.name || '').trim();
    const email = (data.email || '').trim();
    const subject = (data.subject || '').trim();
    const institution = (data.institution || '').trim();
    const message = (data.message || '').trim();

    if (!name || name.length < 2) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      return { success: false, error: 'Please enter a valid academic or professional email address.' };
    }
    if (!subject) {
      return { success: false, error: 'Please select or enter an inquiry subject.' };
    }
    if (!message || message.length < 10) {
      return { success: false, error: 'Message must be at least 10 characters in length.' };
    }

    const ticketId = `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Record in notifications for platform admin
    try {
      db.addNotification({
        user_id: 'a0000000-0000-0000-0000-000000000001',
        event_type: 'contact_inquiry',
        title: `New Consortium Inquiry [${ticketId}]`,
        message: `From ${name} (${email}, ${institution || 'Independent'}): ${subject}. "${message.slice(0, 100)}..."`,
      });
    } catch (e) {
      console.warn('Could not persist contact notification:', e);
    }

    return {
      success: true,
      ticketId,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to submit contact message. Please try again.',
    };
  }
}
