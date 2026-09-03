import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  MessageCircle,
  Edit3,
  Calendar,
  Sparkles,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { mentorService } from '../services/mentorService';
import { MentorTask } from '../types';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface MentorRoadmapScreenProps {
  onNavigate: (route: string) => void;
  onAskSaathi: (prompt: string) => void;
}

export const MentorRoadmapScreen: React.FC<MentorRoadmapScreenProps> = ({
  onNavigate,
  onAskSaathi
}) => {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [tasks, setTasks] = useState<MentorTask[]>(() => mentorService.getTasks());
  const [activeTimeframe, setActiveTimeframe] = useState<
    'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'NEXT_90_DAYS'
  >('TODAY');

  const handleToggle = (taskId: string) => {
    const updated = mentorService.toggleTask(taskId);
    setTasks(updated);
    const target = updated.find((t) => t.id === taskId);
    if (target?.isCompleted) {
      speak('अभिनंदन! हे काम पूर्ण झाले म्हणून नोंदवले आहे.');
    }
  };

  const filteredTasks = tasks.filter((task) => task.timeframe === activeTimeframe);
  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.mentor.title}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {t.mentor.subtitle}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669', backgroundColor: '#DCFCE7', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
            ✓ {completedCount}/{tasks.length} कामे पूर्ण
          </span>
        </div>
      </div>

      {/* 4 Timeframe Filter Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '20px' }}>
        {[
          { id: 'TODAY', label: t.mentor.today },
          { id: 'THIS_WEEK', label: t.mentor.thisWeek },
          { id: 'THIS_MONTH', label: t.mentor.thisMonth },
          { id: 'NEXT_90_DAYS', label: t.mentor.next90Days }
        ].map((tab) => {
          const isSelected = activeTimeframe === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTimeframe(tab.id as any)}
              style={{
                padding: '8px 4px',
                borderRadius: '12px',
                backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                fontWeight: 700,
                fontSize: '0.78rem',
                minHeight: '42px',
                textAlign: 'center'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="saathi-card"
            style={{
              padding: '16px',
              backgroundColor: task.isCompleted ? '#F8FAFC' : '#FFFFFF',
              border: task.isCompleted ? '1px solid #E2E8F0' : '1.5px solid var(--border-medium)',
              opacity: task.isCompleted ? 0.75 : 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <button
                onClick={() => handleToggle(task.id)}
                aria-label={task.isCompleted ? 'पूर्ण झाले' : 'अपूर्ण'}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: task.isCompleted ? '#059669' : 'transparent',
                  border: task.isCompleted ? 'none' : '2px solid var(--border-strong)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                  minHeight: '28px'
                }}
              >
                {task.isCompleted && <CheckSquare size={18} />}
              </button>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    marginBottom: '4px'
                  }}
                >
                  {task.title}
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '10px' }}>
                  {task.description}
                </p>

                {/* Ask SAATHI helper prompt button */}
                {task.voiceActionPrompt && (
                  <button
                    onClick={() => onAskSaathi(task.voiceActionPrompt!)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'var(--primary-subtle)',
                      color: 'var(--primary-dark)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      minHeight: '30px'
                    }}
                  >
                    <MessageCircle size={13} />
                    <span>{task.voiceActionPrompt}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onNavigate('/talk-saathi')}
          className="btn-primary"
          style={{ flex: 2, minHeight: '48px', borderRadius: '14px' }}
        >
          <span>🎙️ साथीला कोणताही प्रश्न विचारा</span>
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onNavigate('/home')}
          className="btn-secondary"
          style={{ flex: 1, minHeight: '48px', borderRadius: '14px' }}
        >
          <ArrowLeft size={16} />
          <span>मुख्य</span>
        </button>
      </div>
    </div>
  );
};
