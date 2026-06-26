import { RouteSkeleton } from '@/components/composed/skeletons';

export default function Loading() {
  return (
    <RouteSkeleton titleWidth={110} introLines={2} cardCount={3} showFooter />
  );
}
