import React from 'react';
import { X, BookOpen, Volume2 } from 'lucide-react';
import { AudioExplainButton } from './AudioExplainButton';

export interface FinancialTermExplanation {
  term: string;
  termNative: string;
  simpleMeaning: string;
  dailyLifeExample: string;
  whyItMatters: string;
  audioText: string;
}

export const FINANCIAL_TERMS_DICTIONARY: Record<string, FinancialTermExplanation> = {
  emi: {
    term: 'EMI (Equated Monthly Installment)',
    termNative: 'मासिक हप्ता (ईएमआय)',
    simpleMeaning: 'घेतलेले कर्ज आणि त्याचे व्याज दरमहा थोडे-थोडे करून बँकेला परत देण्याची ठरलेली रक्कम.',
    dailyLifeExample: 'जसे आपण दुकानातून टीव्ही हप्त्यावर घेतो आणि दरमहा ठरलेले ₹२,००० भरतो, तसेच व्यवसायाचे कर्ज दरमहा ठराविक हप्त्याने परत करावे लागते.',
    whyItMatters: 'नफ्यातून हा हप्ता सहज निघेल एवढीच कर्जाची रक्कम घ्यावी, अन्यथा व्यवसायावर ताण येतो.',
    audioText: 'ईएमआय म्हणजे दरमहा बँकेला भरावयाचा ठरलेला कर्जाचा हप्ता. तुमच्या व्यवसायाच्या नफ्यातून हा हप्ता सहज भरता यायला हवा.'
  },
  working_capital: {
    term: 'Working Capital',
    termNative: 'खेळते भांडवल (व्यवसाय चालवणारा पैसा)',
    simpleMeaning: 'दुकान किंवा कारखाना चालू ठेवण्यासाठी रोजचा कच्चा माल, मजुरी, वीज बिल आणि पेट्रोलसाठी लागणारी रोख रक्कम.',
    dailyLifeExample: 'जसे गाडी चालवण्यासाठी पेट्रोल लागते, तसेच व्यवसाय सुरू झाल्यावर रोज दूध खरेदीसाठी आणि मजुरीसाठी लागणारा पैसा म्हणजे खेळते भांडवल.',
    whyItMatters: 'मशिनरी खरेदी करून पैसे संपले आणि कच्च्या मालाला पैसे नसतील तर व्यवसाय बंद पडतो. म्हणून खेळते भांडवल अत्यंत गरजेचे आहे.',
    audioText: 'खेळते भांडवल म्हणजे रोजचा व्यवसाय चालवण्यासाठी लागणारा पैसा. कच्चा माल खरेदी आणि दैनंदिन खर्चासाठी हे भांडवल वेगळे ठेवणे आवश्यक आहे.'
  },
  margin_money: {
    term: 'Margin Money / Own Contribution',
    termNative: 'स्वतःचे भांडवल (मार्जिन मनी)',
    simpleMeaning: 'प्रकल्पाच्या एकूण खर्चापैकी स्वतःच्या खिशातून घालायची किमान रक्कम (उदा. १०%).',
    dailyLifeExample: '१० लाख रुपयांच्या प्रकल्पासाठी बँक ९ लाख रुपये कर्ज देईल, पण सुरुवातीला १ लाख रुपये स्वतःचे दाखवावे लागतात.',
    whyItMatters: 'बँक पूर्ण १००% कर्ज देत नाही, उद्योजकाचा स्वतःचा वाटा असावा हा नियम असतो.',
    audioText: 'मार्जिन मनी म्हणजे एकूण व्यवसाय खर्चातील स्वतःचा १० टक्के वाटा. उरलेले ९० टक्के पैसे बँक कर्जातून उभे करता येतात.'
  },
  moratorium: {
    term: 'Moratorium Period',
    termNative: 'सवलत काळ / हप्ता सुरू होण्यापूर्वीची सूट',
    simpleMeaning: 'कर्ज घेतल्यानंतर लगेच पूर्ण हप्ता न भरता, व्यवसाय स्थिर होण्यासाठी बँकेने दिलेली ३ ते ६ महिन्यांची सूट.',
    dailyLifeExample: 'पनीरची मशिनरी बसवून ग्राहक मिळेपर्यंत पहिल्या ६ महिन्यांत बँकेला फक्त किरकोळ व्याज द्यावे लागते, मोठा हप्ता ६ महिन्यांनंतर सुरू होतो.',
    whyItMatters: 'व्यवसाय सुरू होताच हप्त्याचा ताण येत नाही.',
    audioText: 'मोरेटोरियम म्हणजे व्यवसाय सुरू झाल्यावर सुरुवातीला मिळालेला सवलतीचा काळ. यादरम्यान पूर्ण हप्ता न भरता फक्त व्याज भरावे लागते.'
  },
  break_even: {
    term: 'Break-Even Point',
    termNative: 'खर्च निघण्याची पातळी (ना नफा ना तोटा)',
    simpleMeaning: 'दिवसाला किंवा महिन्याला किमान किती माल विकल्यावर सर्व खर्च (भाडे, पगार, वीज) निघून तोटा होणार नाही ती संख्या.',
    dailyLifeExample: 'रोज १५ किलो पनीर विकल्यावर सर्व खर्च निघतो; १६ व्या किलोपासून खरा नफा सुरू होतो.',
    whyItMatters: 'कमीत कमी किती विक्री व्हायलाच हवी याचे लक्ष्य समजते.',
    audioText: 'ब्रेक ईव्हन म्हणजे व्यवसायाचा सर्व खर्च भागवण्यासाठी लागणारी किमान विक्री. यापेक्षा जास्त विक्री झाली की नफा होतो.'
  }
};

interface SimpleExplanationModalProps {
  termKey: string | null;
  onClose: () => void;
}

export const SimpleExplanationModal: React.FC<SimpleExplanationModalProps> = ({
  termKey,
  onClose
}) => {
  if (!termKey) return null;

  const info = FINANCIAL_TERMS_DICTIONARY[termKey] || {
    term: termKey,
    termNative: termKey,
    simpleMeaning: 'हा व्यवसायातील महत्त्वाचा आर्थिक भाग आहे.',
    dailyLifeExample: 'व्यवसाय चांगल्या प्रकारे चालवण्यासाठी याचे नियोजन गरजेचे असते.',
    whyItMatters: 'योग्य निर्णय घेण्यासाठी ही माहिती मदत करते.',
    audioText: 'या संकल्पनेचा वापर व्यवसाय नियोजनात केला जातो.'
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '500px',
          padding: '24px',
          boxShadow: 'var(--shadow-floating)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '4px' }}>
              <BookOpen size={15} />
              <span>सोप्या भाषेत समजावून सांगा</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{info.termNative}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{info.term}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-medium)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Audio Button */}
        <div style={{ marginBottom: '18px' }}>
          <AudioExplainButton
            id={`audio_term_${termKey}`}
            textToSpeak={info.audioText}
            label="🔊 आवाजात ऐका"
            size="md"
          />
        </div>

        {/* Simple meaning box */}
        <div
          style={{
            padding: '14px',
            backgroundColor: 'var(--primary-subtle)',
            borderRadius: '14px',
            border: '1px solid rgba(194, 65, 12, 0.2)',
            marginBottom: '16px'
          }}
        >
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-dark)', marginBottom: '4px' }}>
            💡 याचा सोपा अर्थ काय?
          </div>
          <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {info.simpleMeaning}
          </p>
        </div>

        {/* Daily Life Analogy */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            🏡 रोजच्या जीवनातील उदाहरण:
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {info.dailyLifeExample}
          </p>
        </div>

        {/* Why it matters */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            🎯 तुमच्यासाठी हे का महत्त्वाचे आहे?
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {info.whyItMatters}
          </p>
        </div>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', minHeight: '48px' }}
        >
          समजले, धन्यवाद
        </button>
      </div>
    </div>
  );
};
