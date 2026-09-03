import React from 'react';
import { Volume2, Square, VolumeX } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';
import { useLanguage } from '../../context/LanguageContext';

interface AudioExplainButtonProps {
  id: string;
  textToSpeak: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioExplainButton: React.FC<AudioExplainButtonProps> = ({
  id,
  textToSpeak,
  label,
  className = '',
  size = 'md'
}) => {
  const { speak, stopSpeaking, isSpeaking, speakingTextId, setSpeakingTextId } = useVoice();
  const { t } = useLanguage();

  const isCurrentPlaying = isSpeaking && speakingTextId === id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentPlaying) {
      stopSpeaking();
    } else {
      setSpeakingTextId(id);
      speak(textToSpeak);
    }
  };

  const displayLabel = label || (isCurrentPlaying ? t.common.stopAudio : t.common.listenAudio);

  const paddingStyle =
    size === 'sm'
      ? { padding: '4px 10px', fontSize: '0.78rem', minHeight: '34px' }
      : size === 'lg'
      ? { padding: '10px 20px', fontSize: '0.95rem', minHeight: '48px' }
      : { padding: '6px 14px', fontSize: '0.84rem', minHeight: '40px' };

  return (
    <button
      type="button"
      className={`btn-audio-pill ${isCurrentPlaying ? 'playing' : ''} ${className}`}
      style={paddingStyle}
      onClick={handleClick}
      aria-label={displayLabel}
      title={isCurrentPlaying ? 'थांबवण्यासाठी क्लिक करा' : 'आवाज ऐकण्यासाठी क्लिक करा'}
    >
      {isCurrentPlaying ? (
        <>
          <Square size={size === 'sm' ? 12 : 15} fill="currentColor" />
          <span>{displayLabel}</span>
          <span style={{ display: 'flex', gap: '2px', alignItems: 'center', marginLeft: '4px' }}>
            <span className="wave-bar" style={{ height: '12px', width: '2px', backgroundColor: '#FFF' }}></span>
            <span className="wave-bar" style={{ height: '18px', width: '2px', backgroundColor: '#FFF' }}></span>
            <span className="wave-bar" style={{ height: '10px', width: '2px', backgroundColor: '#FFF' }}></span>
          </span>
        </>
      ) : (
        <>
          <Volume2 size={size === 'sm' ? 13 : 16} />
          <span>{displayLabel}</span>
        </>
      )}
    </button>
  );
};
