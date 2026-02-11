/**
 * SourceSelector - Multi-select pill chips for trigger source
 * 13 options (prime), matching TriggerChips visual style
 */

import TriggerChips from '@/components/ui/TriggerChips';
import { SOURCE_OPTIONS } from '@/lib/constants';

export default function SourceSelector({ selected, onToggle, className = '' }) {
  return (
    <TriggerChips
      items={SOURCE_OPTIONS}
      selected={selected}
      onToggle={onToggle}
      multiSelect={true}
      className={className}
    />
  );
}
