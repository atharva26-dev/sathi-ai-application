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
  const { t, language } = useLanguage();
  const pricing = marketingService.getPricingGuidance(language);
  const [testPrice, setTestPrice] = useState<number>(pricing.recommendedPrice);

  const profitPerUnit = testPrice - pricing.costPerUnit;
  const marginPercent = Math.round((profitPerUnit / testPrice) * 100);

  const voiceText =
    language === 'mr'
      ? `१ किलो पनीर तयार करण्यासाठी अंदाजे ₹२४५ खर्च येतो. बाजारात चालू भाव ₹३०० ते ₹३६० आहे. हॉटेल्सना ₹३१० आणि किरकोळ ₹३४० भाव ठेवल्यास तुम्हाला प्रति किलो ₹७५ चा उत्तम नफा राहील.`
      : language === 'hi'
      ? `1 किलो उत्पाद तैयार करने में लगभग ₹245 लागत आती है। बाजार में प्रचलित दर ₹300 से ₹360 है। ₹320 की अनुशंसित दर पर आपको प्रति किलो ₹75 (25%) का शुद्ध लाभ मिलेगा।`
      : `Production cost is approximately ₹245 per unit. Current market prices range between ₹300 and ₹360. At the recommended ₹320 price point, you retain a healthy margin of ₹75 (25%) per unit.`;

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
              evidence: ['स्थानिक भाव सर्वेक्षण', 'कच्चा माल खर्च प्रमाण'],
              lastUpdated: '२०२६'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
          <span className="num-font" style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary-dark)' }}>
            ₹{pricing.recommendedPrice}
          </span>
          <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {language === 'mr' ? 'प्रति किलो' : language === 'hi' ? 'प्रति किलो' : 'per unit'}
          </span>
        </div>

        {/* 3 Price Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div style={{ padding: '10px 8px', backgroundColor: 'var(--bg-app)', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.pricing.costPrice}</div>
            <div className="num-font" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              ₹{pricing.costPerUnit}
            </div>
          </div>

          <div style={{ padding: '10px 8px', backgroundColor: 'var(--bg-app)', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.pricing.profitMargin}</div>
            <div className="num-font" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--success)', marginTop: '2px' }}>
              ₹{pricing.marginAtRecommended}
            </div>
          </div>

          <div style={{ padding: '10px 8px', backgroundColor: 'var(--bg-app)', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.pricing.competitorBand}</div>
            <div className="num-font" style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '4px' }}>
              ₹{pricing.competitorPriceRange.min}-{pricing.competitorPriceRange.max}
            </div>
          </div>
        </div>
      </div>

      {/* Practical Strategy Tip */}
      <div
        className="saathi-card"
        style={{
          padding: '16px',
          backgroundColor: '#FFF7ED',
          border: '1.5px solid #FED7AA',
          marginBottom: '20px'
        }}
      >
        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#9A3412', marginBottom: '4px' }}>
          {language === 'mr' ? '💡 दोन प्रकारची विक्री रचना:' : language === 'hi' ? '💡 द्विस्तरीय मूल्य निर्धारण (Two-Tier Pricing):' : '💡 Two-Tier Pricing Strategy:'}
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
          {pricing.simpleTip}
        </p>
      </div>

      {/* "What If" Price Adjustment Slider */}
      <div className="saathi-card" style={{ padding: '18px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
          {language === 'mr' ? 'दर कमी-जास्त करून नफा तपासा:' : language === 'hi' ? 'मूल्य समायोजित करके लाभ जांचें:' : 'Simulate Custom Price & Profit:'}
        </h3>

        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
              {language === 'mr' ? 'चाचणी विक्री दर:' : language === 'hi' ? 'परीक्षण विक्रय मूल्य:' : 'Test Selling Price:'}
            </span>
            <span className="num-font" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              ₹{testPrice} {language === 'mr' ? 'प्रति किलो' : language === 'hi' ? 'प्रति किलो' : '/ unit'}
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
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {language === 'mr' ? 'प्रति किलो निव्वळ नफा:' : language === 'hi' ? 'प्रति इकाई शुद्ध लाभ:' : 'Net Profit Per Unit:'}
            </div>
            <div className="num-font" style={{ fontSize: '1.1rem', fontWeight: 800, color: profitPerUnit > 0 ? 'var(--success)' : 'var(--danger)' }}>
              ₹{profitPerUnit}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {language === 'mr' ? 'नफा मार्जिन:' : language === 'hi' ? 'लाभ मार्जिन:' : 'Margin Percentage:'}
            </div>
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
          <span>
            {language === 'mr' ? '🚀 व्यवसाय वाढवण्याचा रोडमॅप' : language === 'hi' ? '🚀 व्यवसाय विस्तार रोडमैप' : '🚀 Business Expansion Roadmap'}
          </span>
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onNavigate('/marketing')}
          className="btn-secondary"
          style={{ flex: 1, minHeight: '48px', borderRadius: '14px' }}
        >
          <ArrowLeft size={16} />
          <span>{t.common.back}</span>
        </button>
      </div>
    </div>
  );
};
