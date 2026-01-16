import React, { useState } from 'react';
import './LegalDocuments.css';
import { t } from '../utils/i18n';

function LegalDocuments() {
  const [activeDoc, setActiveDoc] = useState(null);

  const documents = [
    {
      id: 'privacy',
      title: t('legal.privacy.title'),
      content: t('legal.privacy.content')
    },
    {
      id: 'terms',
      title: t('legal.terms.title'),
      content: t('legal.terms.content')
    },
    {
      id: 'agreement',
      title: t('legal.agreement.title'),
      content: t('legal.agreement.content')
    },
    {
      id: 'commission',
      title: t('legal.commission.title'),
      content: t('legal.commission.content')
    },
    {
      id: 'bonuses',
      title: t('legal.bonuses.title'),
      content: t('legal.bonuses.content')
    }
  ];

  return (
    <div className="legal-documents">
      <h3 className="legal-title">Правові документи</h3>
      <div className="documents-list">
        {documents.map((doc) => (
          <div key={doc.id} className="document-item glass-card">
            <div className="document-header">
              <h4 className="document-title">{doc.title}</h4>
              <button
                className="document-toggle"
                onClick={() => setActiveDoc(activeDoc === doc.id ? null : doc.id)}
              >
                {activeDoc === doc.id ? '▼' : '▶'}
              </button>
            </div>
            {activeDoc === doc.id && (
              <div className="document-content">
                <pre>{doc.content}</pre>
                <button className="btn btn-secondary document-close" onClick={() => setActiveDoc(null)}>
                  Закрити
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LegalDocuments;
