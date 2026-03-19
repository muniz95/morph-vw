import { useTonesController } from '@/features/tones/infrastructure/controllers/use-tones-controller';
import TonesList from '@/features/tones/ui/components/tones-list';

const TonesPage = () => {
  const { tones, playTone, isPlaying, selectedTone } = useTonesController();

  return (
    <TonesList
      activeToneName={selectedTone?.name}
      tones={tones}
      onPlayTone={playTone}
      controlsLocked={isPlaying}
    />
  );
};

export default TonesPage;
