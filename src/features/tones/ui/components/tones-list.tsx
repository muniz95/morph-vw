import { Tone } from '@/features/tones/domain/tone';
import ListItem from '@/shared/ui/list-item';
import HomeScreen from '@/shared/ui/home-screen';

interface TonesListProps {
  activeToneName?: string;
  controlsLocked: boolean;
  tones: Tone[];
  onPlayTone: (tone: Tone) => void;
}

const TonesList = ({
  activeToneName,
  tones,
  onPlayTone,
  controlsLocked,
}: TonesListProps) => {
  return (
    <HomeScreen>
      {tones.map((tone) => (
        <ListItem
          active={activeToneName === tone.name}
          key={tone.name}
          onClick={() => onPlayTone(tone)}
          disabled={controlsLocked}
        >
          {tone.name}
        </ListItem>
      ))}
    </HomeScreen>
  );
};

export default TonesList;
