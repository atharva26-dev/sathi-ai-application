import React, { useState } from 'react';
import { Tag, IndianRupee, TrendingUp, AlertCircle, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { marketingService } from '../services/marketingService';
import { DataTrustBadge } from '../components/common/DataTrustBadge';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface PricingStrategyScreenProps {
  onNavigate: (route: string) => void;
}

export const PricingStrategyScreen: React.FC<PricingStrategyScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const pricing = marketingService.getPricingGuidance();
  const [testPrice, setTestPrice] = useState<number>(pricing.recommendedPrice);

  const profitPerUnit = testPrice - pricing.costPerUnit;
  const marginPercent = Math.round((profitPerUnit / testPrice) * 100);

  const voiceText = `१ किलो पनीर तयार करण्यासाठी अंदाजे ₹२४५ खर्च येतो. बाजारात चालू भाव ₹३०० ते ₹३६० आहे. हॉटेल्सना ₹३१० आणि किरकोळ ₹३४० भाव ठेवल्यास तुम्हाला प्रति किलो ₹७५ चा उत्तम नफा राहील.`;

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.pricing.title}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {t.pricing.subtitle}
          </p>
        </div>

        <AudioExplainButton
          id="audio_pricing_summary"
          textToSpeak={voiceText}
          size="sm"
        />
      </div>

      {/* Recommended Price Hero Box */}
      <div
        className="saathi-card"
        style={{
          padding: '20px',
          backgroundColor: '#FFFFFF',
          border: '2px solid var(--primary)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>
            {t.pricing.recommendedPrice}:
          </span>
          <DataTrustBadge
            trustInfo={{
              level: 'CALCULATED',
              confidenceScore: 90,
              assumptions: ['५ लिटर दूध @ ₹३६ = ₹१८०', 'प्रक्रिया व वीज ₹६५']
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
          <div className="num-font" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
            ₹{pricing.recommendedPrice}
          </div>
          <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>प्रति किलो</span>
          <span
            style={{
              marginLeft: 'auto',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#DCFCE7',
              color: '#166534',
              fontWeight: 800,
              fontSize: '0.82rem'
            }}
          >
            ₹{pricing.marginAtRecommended} नफा/किलो (२३.४%)
          </span>
        </div>

        {/* 3 Price Level Points */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
          <div style={{ padding: '8px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>तयार करायचा खर्च</div>
            <div className="num-font" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--danger)' }}>
              ₹{pricing.costPerUnit}
            </div>
          </div>

          <div style={{ padding: '8px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>बाजारातील भाव</div>
            <div className="num-font" style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
              ₹{pricing.competitorPriceRange.min} - {pricing.competitorPriceRange.max}
            </div>
          </div>

          <div style={{ padding: '8px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>योग्य पट्टा</div>
            <div className="num-font" style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--success)' }}>
              ₹{pricing.suggestedPriceFloor} - {pricing.suggestedPriceCeiling}
            </div>
          </div>
        </div>
      </div>

      {/* Practical Advice Tip Box */}
      <div
        className="saathi-card"
        style={{
          padding: '14px',
          backgroundColor: '#FFF7ED',
          border: '1px solid #FED7AA',
          marginBottom: '20px'
        }}
      >
        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#9A3412', marginBottom: '4px' }}>
          💡 दोन प्रकारची विक्री रचना:
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
          {pricing.simpleTip}
        </p>
      </div>

      {/* "What If" Price Adjustment Slider */}
      <div className="saathi-card" style={{ padding: '18px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
          दर कमी-जास्त करून नफा तपासा:
        </h3>

        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>चाचणी विक्री दर:</span>
            <span className="num-font" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              ₹{testPrice} प्रति किलो
            </span>
          </div>
          <input
            type="range"
            min="260"
            max="380"
            step="5"
            value={testPrice}
            onChange={(e) => setTestPrice(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px', marginTop: '10px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>प्रति किलो निव्वळ नफा:</div>
            <div className="num-font" style={{ fontSize: '1.1rem', fontWeight: 800, color: profitPerUnit > 0 ? 'var(--success)' : 'var(--danger)' }}>
              ₹{profitPerUnit}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>नफा मार्जिन:</div>
            <div className="num-font" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              {marginPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onNavigate('/expansion')}
          className="btn-primary"
          style={{ flex: 2, minHeight: '48px', borderRadius: '14px' }}
        >
          <span>🚀 व्यवसाय वाढवण्याचा रोडमॅप</span>
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onNavigate('/marketing')}
          className="btn-secondary"
          style={{ flex: 1, minHeight: '48px', borderRadius: '14px' }}
        >
          <ArrowLeft size={16} />
          <span>मागे</span>
        </button>
      </div>
    </div>
  );
};
