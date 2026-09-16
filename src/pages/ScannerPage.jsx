import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function ScannerPage() {
  const navigate = useNavigate();
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState(null);
  const getCowByQrId = useAppStore(state => state.getCowByQrId);
  const user = useAppStore(state => state.user);

  const scannerInitialized = React.useRef(false);

  useEffect(() => {
    if (scannerInitialized.current) return;
    scannerInitialized.current = true;

    // init scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: {width: 250, height: 250}, aspectRatio: 1.0 },
      /* verbose= */ false
    );

    const onScanSuccess = (decodedText) => {
      // cleanup
      const uid = decodedText.trim();
      scanner.clear();
      processScannedCode(uid);
    };

    const onScanFailure = (error) => {
      // Ignored
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(e => console.error("Failed to clear scanner", e));
    };
  }, []);

  const processScannedCode = (uid) => {
    // weak validation for demo
    if (uid.length < 2) {
      setError("Invalid RFID tag. Code must be longer.");
      return;
    }

    const cow = getCowByQrId(uid);
    if (cow) {
      // navigate to existing
      navigate(`/cow/${uid}`);
    } else {
      // not found, register new
      if (user?.role === 'tagging_agent') {
        navigate(`/register/${uid}`);
      } else {
        setError(`Not Found! The Tag (${uid}) is not registered in the database.`);
      }
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if(manualCode) {
      // unmount hack to drop camera instance
      processScannedCode(manualCode);
    }
  };

  return (
    <>
      <div className="header">
        <h1>
          <ArrowLeft size={24} onClick={() => navigate(-1)} style={{cursor: 'pointer'}} color="var(--text-primary)" /> 
          Scan Tag
        </h1>
      </div>
      <div className="content">
        {error && (
          <div className="card" style={{ backgroundColor: 'var(--danger-color)', color: 'white', border: 'none' }}>
            {error}
            <button className="btn btn-outline" style={{marginTop: '1rem', borderColor: 'rgba(255,255,255,0.5)', color: 'white'}} onClick={() => setError(null)}>
              Try Again
            </button>
          </div>
        )}

        <div style={{ display: error ? 'none' : 'block' }}>
          <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Scan the 15-digit ultra-high frequency (UHF) RFID Tag.
          </p>
          
          <div className="video-container" id="reader" style={{ width: '100%', minHeight: '300px' }}></div>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem' }}>--- OR ---</p>
            <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter 15-digit Code" 
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
                <Edit3 size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
