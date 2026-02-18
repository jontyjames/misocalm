/**
 * Log Page - Redirect to new journal entry
 */

import { redirect } from 'next/navigation';

export default function LogPage() {
  redirect('/journal/new');
}
