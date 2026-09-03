import React, { useState } from 'react';
import { Calculator, RotateCcw, TrendingUp, IndianRupee, HelpCircle, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { businessService } from '../services/businessService';
import { SimulatorInputs } from '../types';
import { DataTrustBadge } from '../components/common/DataTrustBadge';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface BusinessSimulatorScreenProps {
  onNavigate: (route: string) => void;
}

const DEFAULT_SIMULATOR_INPUTS: SimulatorInputs = {
  unitsPerDay: 25, // 25 kg paneer/day
  sellingPricePerUnit: 320, // ₹320/kg
  rawMaterialCostPerUnit: 180, // 5L milk @ ₹36 = ₹180
  monthlyLaborCost: 10000,
  monthlyTransportCost: 4500,
  monthlyRentAndPower: 6000,
  otherFixedCost: 2000
};

export const BusinessSimulatorScreen: React.FC<BusinessSimulatorScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_SIMULATOR_INPUTS);

  const outputs = businessService.calculateSimulator(inputs);

  const voiceSummary = `दररोज ${inputs.unitsPerDay} किलो पनीर ₹${inputs.sellingPricePerUnit} भावाने विकल्यास महिन्याला एकूण ₹${outputs.monthlyRevenue.toLocaleString(
    'en-IN'
  )} चा गल्ला होईल आणि सर्व खर्च वजा जाता ₹${outputs.netMonthlySurplus.toLocaleString(
    'en-IN'
  )} चा निव्वळ नफा उरेल.`;

  const handleReset = () => {
    setInputs(DEFAULT_SIMULATOR_INPUTS);
  };

  return (
    <div className="screen-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.simulator.title}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {t.simulator.subtitle}
          </p>
        </div>

        <AudioExplainButton
          id="audio_simulator_summary"
          textToSpeak={voiceSummary}
          size="sm"
        />
      </div>

      {/* Dynamic Results Top Hero Card */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            अंदाजित मासिक निव्वळ नफा (Surplus):
          </span>
          <DataTrustBadge
            trustInfo={{
              level: 'CALCULATED',
              confidenceScore: 92,
              assumptions: ['३० दिवस महिना', 'ठरलेला कच्चा माल दर']
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
          <div className="num-font" style={{ fontSize: '2rem', fontWeight: 800, color: outputs.netMonthlySurplus > 0 ? 'var(--success)' : 'var(--danger)' }}>
            ₹{outputs.netMonthlySurplus.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t.common.perMonth}</span>
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
            {outputs.marginPercent}% नफा मार्जिन
          </span>
        </div>

        {/* 3 Key Calculated Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div style={{ padding: '8px', backgroundColor: 'var(--bg-app)', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>एकूण विक्री (Revenue)</div>
            <div className="num-font" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              ₹{(outputs.monthlyRevenue / 1000).toFixed(0)}k
            </div>
          </div>

          <div style={{ padding: '8px', backgroundColor: 'var(--bg-app)', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>एकूण खर्च (Cost)</div>
            <div className="num-font" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
              ₹{(outputs.totalMonthlyCosts / 1000).toFixed(0)}k
            </div>
          </div>

          <div style={{ padding: '8px', backgroundColor: 'var(--bg-app)', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>खर्च निघण्याचे लक्ष्य</div>
            <div className="num-font" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {outputs.breakEvenUnitsPerDay} kg/दिवस
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Control Sliders */}
      <div className="saathi-card" style={{ padding: '18px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            आकडेमोड बदलून पाहा:
          </h3>
          <button
            onClick={handleReset}
            style={{
              fontSize: '0.78rem',
              color: 'var(--primary-dark)',
              backgroundColor: 'var(--primary-subtle)',
              padding: '4px 10px',
              borderRadius: '8px',
              minHeight: 'auto'
            }}
          >
            <RotateCcw size={13} /> {t.simulator.resetDefaults}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Slider 1: Daily Production Volume */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.88rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {t.simulator.dailyProduction}:
              </span>
              <span className="num-font" style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>
                {inputs.unitsPerDay} किलो/दिवस
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={inputs.unitsPerDay}
              onChange={(e) => setInputs({ ...inputs, unitsPerDay: parseInt(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>१० किलो (लहान)</span>
              <span>५० किलो (मध्यम)</span>
              <span>१०० किलो (मोठा)</span>
            </div>
          </div>

          {/* Slider 2: Selling Price Per Unit */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.88rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {t.simulator.sellingPrice}:
              </span>
              <span className="num-font" style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>
                ₹{inputs.sellingPricePerUnit} प्रति किलो
              </span>
            </div>
            <input
              type="range"
              min="280"
              max="400"
              step="5"
              value={inputs.sellingPricePerUnit}
              onChange={(e) => setInputs({ ...inputs, sellingPricePerUnit: parseInt(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>₹२८० (सवलत दर)</span>
              <span>₹३२० (बाजारातील योग्य दर)</span>
              <span>₹४०० (प्रीमियम दर)</span>
            </div>
          </div>

          {/* Slider 3: Raw Material Cost (Milk) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.88rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {t.simulator.rawMaterialCost} (दूध):
              </span>
              <span className="num-font" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                ₹{inputs.rawMaterialCostPerUnit} (५ लिटर @ ₹{(inputs.rawMaterialCostPerUnit / 5).toFixed(0)})
              </span>
            </div>
            <input
              type="range"
              min="160"
              max="240"
              step="5"
              value={inputs.rawMaterialCostPerUnit}
              onChange={(e) =>
                setInputs({ ...inputs, rawMaterialCostPerUnit: parseInt(e.target.value) })
              }
              style={{ width: '100%', accentColor: '#D97706', cursor: 'pointer' }}
            />
          </div>

          {/* Fixed Costs row */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: '12px',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              मासिक निश्चित खर्च (पगार, भाडे, वीज, वाहतूक):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.82rem' }}>
              <div>पगार/मदतनीस: <strong>₹{inputs.monthlyLaborCost}</strong></div>
              <div>भाडे व वीज: <strong>₹{inputs.monthlyRentAndPower}</strong></div>
              <div>वाहतूक व इंधन: <strong>₹{inputs.monthlyTransportCost}</strong></div>
              <div>इतर खर्च: <strong>₹{inputs.otherFixedCost}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Working Capital Requirement */}
      <div
        className="saathi-card"
        style={{
          padding: '16px',
          backgroundColor: '#FFFBF5',
          border: '1.5px solid #FDBA74',
          marginBottom: '20px'
        }}
      >
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9A3412', marginBottom: '2px' }}>
          💼 आवश्यक खेळते भांडवल (Working Capital):
        </div>
        <div className="num-font" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
          ₹{outputs.suggestedWorkingCapital.toLocaleString('en-IN')}
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          (१५ दिवसांची दूध खरेदी + १ महिन्याचा स्थिर खर्च चालवण्यासाठी)
        </p>
      </div>

      {/* Navigation CTA */}
      <button
        onClick={() => onNavigate('/money-loan')}
        className="btn-primary"
        style={{ width: '100%', minHeight: '52px', fontSize: '1.05rem', borderRadius: '16px' }}
      >
        <span>पैसे आणि कर्ज रचना पाहा (PS-91)</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
