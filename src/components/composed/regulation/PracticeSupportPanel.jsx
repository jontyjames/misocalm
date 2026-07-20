import ButterflyTappingPanel from './ButterflyTappingPanel';
import ColdWaterResetPanel from './ColdWaterResetPanel';
import EmergencyProtocolPanel from './EmergencyProtocolPanel';
import GuidedSequencePanel from './GuidedSequencePanel';
import MimicryBridgePanel from './MimicryBridgePanel';
import MovementResetPanel from './MovementResetPanel';
import SoundSupportPanel from './SoundSupportPanel';

export default function PracticeSupportPanel({ practice, onOpen, onComplete }) {
  if (practice.id === 'butterfly-tapping') return <ButterflyTappingPanel onComplete={onComplete} />;
  if (practice.id === 'body-scan') return <GuidedSequencePanel practice={practice} onComplete={onComplete} />;
  if (practice.id === 'progressive-muscle-relaxation') return <GuidedSequencePanel practice={practice} onComplete={onComplete} />;
  if (practice.id === 'emergency-protocol') return <EmergencyProtocolPanel onOpen={onOpen} onComplete={onComplete} />;
  if (practice.id === 'movement-reset') return <MovementResetPanel onComplete={onComplete} />;
  if (practice.id === 'cold-water-micro-reset') return <ColdWaterResetPanel onComplete={onComplete} />;
  if (practice.id === 'sound-support') return <SoundSupportPanel onComplete={onComplete} />;
  if (practice.id === 'mimicry-bridge') return <MimicryBridgePanel onOpen={onOpen} onComplete={onComplete} />;
  return null;
}
