/**
 * Legacy route - redirects to /journal/saved
 */

import { redirect } from 'next/navigation';

export default function LogSuccessRedirect() {
  redirect('/journal/saved');
}
