import React, { useState } from 'react';
import { MapPin, Navigation, Store, Building2, Truck, Users, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';

interface MapViewProps {
  radiusKm?: number;
  onRadiusChange?: (radius: number) => void;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  radiusKm = 10,
  onRadiusChange,
  className = ''
}) => {
  const { profile } = useUser();
  const { language } = useLanguage();
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CUSTOMERS' | 'SUPPLIERS' | 'COMPETITORS'>('ALL');

  const centerVillage = profile.village || (language === 'en' ? 'Local Center' : 'स्थानिक केंद्र');
  const taluka = profile.block || (language === 'en' ? 'Taluka' : 'तालुका');
  const district = profile.district || (language === 'en' ? 'District' : 'जिल्हा');
  const biz = profile.desiredBusiness || (language === 'en' ? 'Business' : 'व्यवसाय');

  // Dynamic local POI points based on user's actual location
  const customers = [
    { id: 'c1', name: `${centerVillage} ${language === 'en' ? 'Main Market Center' : 'मुख्य बाजारपेठ ग्राहक'}`, type: 'Market Hub', x: 60, y: 40, volume: 'High Demand', status: 'Active' },
    { id: 'c2', name: `${taluka} ${language === 'en' ? 'Road Commercial Cluster' : 'रस्ता व्यापारी संकुल'}`, type: 'Commercial', x: 45, y: 68, volume: 'Regular Orders', status: 'Active' },
    { id: 'c3', name: `${centerVillage} ${language === 'en' ? 'Weekly Haat Point' : 'आठवडी बाजार चौक'}`, type: 'Weekly Haat', x: 75, y: 55, volume: 'Direct Retail', status: 'High Buyer' }
  ];

  const suppliers = [
    { id: 's1', name: `${taluka} ${language === 'en' ? 'Wholesale Materials Hub' : 'घाऊक साहित्य व पुरवठा केंद्र'}`, type: 'Wholesale Supplier', x: 25, y: 65, rate: 'Wholesale Rates' },
    { id: 's2', name: `${centerVillage} ${language === 'en' ? 'Local Transit Point' : 'स्थानिक वाहतूक केंद्र'}`, type: 'Logistics', x: 35, y: 80, rate: 'Standard Freight' }
  ];

  const competitors = [
    { id: 'cp1', name: `${taluka} ${language === 'en' ? 'Town Center Competitor' : 'तालुका शहर व्यावसायिक'}`, x: 85, y: 85, type: 'Town Competitor', note: '15 km away' },
    { id: 'cp2', name: `${centerVillage} ${language === 'en' ? 'Local Basic Shop' : 'स्थानिक लहान दुकान'}`, x: 42, y: 35, type: 'Local Shop', note: 'Limited capabilities' }
  ];

  return (
    <div
      className={`saathi-card ${className}`}
      style={{
        padding: '16px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Map Control Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {centerVillage} • {radiusKm} {language === 'en' ? 'km radius' : 'किमी परीघ'}
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
            {taluka}, {district}
          </p>
        </div>

        {/* Radius toggle selector */}
        {onRadiusChange && (
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => onRadiusChange(5)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                backgroundColor: radiusKm === 5 ? 'var(--primary)' : 'transparent',
                color: radiusKm === 5 ? '#FFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                minHeight: '28px'
              }}
            >
              5 km
            </button>
            <button
              onClick={() => onRadiusChange(10)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                backgroundColor: radiusKm === 10 ? 'var(--primary)' : 'transparent',
                color: radiusKm === 10 ? '#FFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                minHeight: '28px'
              }}
            >
              10 km
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'ALL', label: language === 'en' ? 'All Points' : 'सर्व घटक' },
          { id: 'CUSTOMERS', label: `🎯 ${language === 'en' ? 'Buyers' : 'संभाव्य ग्राहक'}` },
          { id: 'SUPPLIERS', label: `📦 ${language === 'en' ? 'Suppliers' : 'पुरवठादार'}` },
          { id: 'COMPETITORS', label: `🏪 ${language === 'en' ? 'Competitors' : 'प्रतिस्पर्धी'}` }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 700,
              border: 'none',
              backgroundColor: activeFilter === f.id ? 'var(--primary)' : '#F8FAFC',
              color: activeFilter === f.id ? '#FFF' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Dynamic Simulated Map Canvas */}
      <div
        style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          border: '1.5px solid #E2E8F0',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Center Village Marker */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#EA580C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 0 0 6px rgba(234, 88, 12, 0.2)'
            }}
          >
            <MapPin size={16} />
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', backgroundColor: '#FFF', padding: '1px 6px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {centerVillage}
          </span>
        </div>

        {/* Customer Points */}
        {(activeFilter === 'ALL' || activeFilter === 'CUSTOMERS') &&
          customers.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedPoint(c)}
              style={{
                position: 'absolute',
                left: `${c.x}%`,
                top: `${c.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                color: '#FFF',
                border: '2px solid #FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                zIndex: 5
              }}
              title={c.name}
            >
              <Users size={12} />
            </button>
          ))}

        {/* Supplier Points */}
        {(activeFilter === 'ALL' || activeFilter === 'SUPPLIERS') &&
          suppliers.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedPoint(s)}
              style={{
                position: 'absolute',
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                color: '#FFF',
                border: '2px solid #FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                zIndex: 5
              }}
              title={s.name}
            >
              <Truck size={12} />
            </button>
          ))}

        {/* Competitor Points */}
        {(activeFilter === 'ALL' || activeFilter === 'COMPETITORS') &&
          competitors.map((cp) => (
            <button
              key={cp.id}
              onClick={() => setSelectedPoint(cp)}
              style={{
                position: 'absolute',
                left: `${cp.x}%`,
                top: `${cp.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                color: '#FFF',
                border: '2px solid #FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                zIndex: 5
              }}
              title={cp.name}
            >
              <Store size={12} />
            </button>
          ))}
      </div>

      {/* Selected Point Popover */}
      {selectedPoint && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {selectedPoint.name}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              {selectedPoint.type} • {selectedPoint.volume || selectedPoint.rate || selectedPoint.note}
            </div>
          </div>
          <button
            onClick={() => setSelectedPoint(null)}
            style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
