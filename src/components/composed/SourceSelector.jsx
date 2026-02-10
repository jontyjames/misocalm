/**
 * SourceSelector - Single-select pill chips for trigger source
 * 13 options (prime), matching TriggerChips visual style
 */

import TriggerChips from '@/components/ui/TriggerChips';
import { SOURCE_OPTIONS } from '@/lib/constants';

export default function SourceSelector({ value, onChange, className = '' }) {
  return (
    <TriggerChips
      items={SOURCE_OPTIONS}
      selected={value}
      onToggle={(val) => onChange(val === value ? '' : val)}
      multiSelect={false}
      className={className}
    />
  );
}
