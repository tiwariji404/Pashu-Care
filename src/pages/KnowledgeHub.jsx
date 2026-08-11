import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, HeartPulse, Droplet, Landmark, ChevronDown, ChevronUp, Baby, Syringe } from 'lucide-react';

export default function KnowledgeHub() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const sections = [
    {
      id: 'nutrition',
      title: 'Nutrition & Yield (खान-पान और दूध)',
      icon: <Droplet color="#3b82f6" />,
      content: (
        <>
          <p>गाय का दूध बढ़ाने के लिए संतुलित आहार (Balanced Diet) बहुत जरूरी है।</p>
          <ul>
            <li><strong>हरा चारा (Green Fodder):</strong> नेपियर घास (Napier grass) या अजोला (Azolla) खिलाएं। इसमें प्रोटीन ज्यादा होता है।</li>
            <li><strong>खल और दाना:</strong> सरसों या बिनौला की खल को डाइट में शामिल करें।</li>
            <li><strong>पानी:</strong> एक गाय को दिन में कम से कम 30-40 लीटर साफ पानी दें, गर्मियों में इसकी मात्रा दोगुनी कर दें।</li>
            <li><strong>खनिज मिश्रण (Mineral Mixture):</strong> रोजाना 50-100 ग्राम मिनरल मिक्सचर दें, इससे कैल्शियम की कमी नहीं होगी।</li>
          </ul>
        </>
      )
    },
    {
      id: 'firstaid',
      title: 'Home Remedies (घरेलू उपचार)',
      icon: <HeartPulse color="#ef4444" />,
      content: (
        <>
          <p>कुछ छोटी बीमारियों के लिए घरेलू नुस्खे आजमाए जा सकते हैं:</p>
          <ul>
            <li><strong>अफारा (Bloating):</strong> 100 ग्राम सरसों के तेल में 50 ग्राम तारपीन का तेल और थोड़ी हींग मिलाकर पिलाएं।</li>
            <li><strong>छोटे घाव (Minor Cuts):</strong> हल्दी और सरसों का तेल मिलाकर लेप लगाएं, यह एंटीसेप्टिक का काम करता है।</li>
            <li><strong>केंचुए/जूं (Ticks):</strong> नीम के पत्तों को पानी में उबालकर उस पानी से गाय को नहलाएं। कभी भी केमिकल का ज्यादा इस्तेमाल न करें।</li>
          </ul>
          <p style={{ marginTop: '0.5rem', color: '#ef4444', fontWeight: 500, fontSize: '0.85rem' }}>*नोट: गंभीर बीमारी होने पर तुरंत 'Vet Doctors' सेक्शन से डॉक्टर को बुलाएं।</p>
        </>
      )
    },
    {
      id: 'schemes',
      title: 'Govt Schemes (सरकारी योजनाएं)',
      icon: <Landmark color="#10b981" />,
      content: (
        <>
          <p>सरकार पशुपालकों के लिए कई योजनाएं चला रही है, जिनके बारे में जानकारी होना जरूरी है:</p>
          <ul>
            <li><strong>KCC (पशुपालन किसान क्रेडिट कार्ड):</strong> इसके तहत आपको गाय भैस पालने (चारा और देखभाल) के लिए कम ब्याज (4%) पर लोन मिल सकता है। अपनी बैंक शाखा से संपर्क करें।</li>
            <li><strong>पशु बीमा (Livestock Insurance):</strong> अनहोनी होने पर नुकसान से बचने के लिए गाय का बीमा जरूर करवाएं। सरकार इसमें प्रीमियम पर सब्सिडी भी देती है।</li>
            <li><strong>राष्ट्रीय गोकुल मिशन:</strong> देसी नस्लों (जैसे गिर, साहीवाल) के विकास और संरक्षण के लिए इस योजना के तहत मदद दी जाती है।</li>
          </ul>
        </>
      )
    },
    {
      id: 'pregnancy',
      title: 'Pregnancy Care (गर्भावस्था देखभाल)',
      icon: <Baby color="#ec4899" />,
      content: (
        <>
          <p>गाभिन (Pregnant) गाय की विशेष देखभाल जरूरी है:</p>
          <ul>
            <li><strong>आहार:</strong> आखिरी 2-3 महीनों में गाय को अतिरिक्त 1-2 किलो दाना रोज दें।</li>
            <li><strong>सुरक्षा:</strong> फिसलने वाली जगहों से बचाएं, और गाय को अन्य आक्रामक जानवरों से अलग रखें।</li>
            <li><strong>आराम:</strong> बैठने के लिए सूखी और साफ जगह (रेत या रबर मैट) का इंतजाम करें।</li>
          </ul>
        </>
      )
    },
    {
      id: 'vaccination',
      title: 'Vaccination (टीकाकरण अनुसूची)',
      icon: <Syringe color="#8b5cf6" />,
      content: (
        <>
          <p>बीमारियों से बचाव के लिए समय पर टीके लगवाना बेहद जरूरी है:</p>
          <ul>
            <li><strong>FMD (खुरपका-मुंहपका):</strong> साल में दो बार (फरवरी-मार्च और सितंबर-अक्टूबर)।</li>
            <li><strong>HS (गलघोंटू) & BQ (लंगड़ा बुखार):</strong> हर साल मानसून (मई-जून) से पहले।</li>
            <li><strong>Brucellosis:</strong> 4 से 8 महीने की बछिया को जीवन में सिर्फ एक बार।</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <>
      <div className="header">
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} /> 
          Pashu Gyan (Knowledge Hub)
        </h1>
      </div>
      <div className="content">
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <BookOpen size={48} color="#ca8a04" style={{ margin: '0 auto', opacity: 0.8 }} />
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
            पशुपालन को बेहतर और लाभकारी बनाने के लिए महत्वपूर्ण जानकारी।
          </p>
        </div>

        {sections.map(section => (
          <div key={section.id} className="card" style={{ padding: '0', marginBottom: '1rem', overflow: 'hidden' }}>
            <div 
              style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', backgroundColor: expandedSection === section.id ? 'var(--bg-color)' : 'transparent' }}
              onClick={() => toggleSection(section.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {section.icon}
                <strong style={{ fontSize: '1rem' }}>{section.title}</strong>
              </div>
              {expandedSection === section.id ? <ChevronUp size={20} color="var(--text-secondary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
            </div>
            
            {expandedSection === section.id && (
              <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', lineHeight: 1.6, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {section.content}
              </div>
            )}
          </div>
        ))}

      </div>
    </>
  );
}
