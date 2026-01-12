'use client';

import { useState } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  File,
  Image,
  X
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded_at: string;
  status: 'pending' | 'verified' | 'rejected';
  document_type: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'CV_Anna_Svensson.pdf',
    type: 'application/pdf',
    size: '245 KB',
    uploaded_at: '2024-01-10T10:00:00Z',
    status: 'verified',
    document_type: 'other'
  },
  {
    id: '2',
    name: 'Referensbrev.pdf',
    type: 'application/pdf',
    size: '128 KB',
    uploaded_at: '2024-01-11T14:30:00Z',
    status: 'pending',
    document_type: 'reference_letter'
  }
];

const documentTypes = [
  { value: 'certification', label: 'Certifikat/Intyg' },
  { value: 'reference_letter', label: 'Referensbrev' },
  { value: 'id_document', label: 'ID-handling' },
  { value: 'other', label: 'Övrigt' }
];

export default function VolunteerDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedType, setSelectedType] = useState('other');
  const [dragActive, setDragActive] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            <CheckCircle size={12} />
            Verifierad
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
            <Clock size={12} />
            Väntar
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
            <AlertCircle size={12} />
            Avvisad
          </span>
        );
      default:
        return null;
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) {
      return <Image size={24} className="text-blue-500" />;
    }
    return <File size={24} className="text-gray-500" />;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: `${Math.round(file.size / 1024)} KB`,
      uploaded_at: new Date().toISOString(),
      status: 'pending',
      document_type: selectedType
    };
    
    setDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
    alert('Dokument uppladdat!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Är du säker att du vill ta bort detta dokument?')) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dokument</h1>
          <p className="text-sm text-gray-500">Hantera dina uppladdade dokument</p>
        </div>
        
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-[#006B7D] text-white rounded-lg hover:bg-[#005a6a] transition-colors flex items-center gap-2"
        >
          <Upload size={16} />
          Ladda upp
        </button>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900">
            Du kan ladda upp dokument som stödjer din ansökan, till exempel referensbrev, certifikat eller intyg.
            Socialsekreteraren kommer att granska dina dokument.
          </p>
        </div>
      </div>

      {/* Documents list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {documents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inga dokument</h3>
            <p className="text-gray-500 mb-4">Du har inte laddat upp några dokument ännu.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-[#006B7D] text-white rounded-lg hover:bg-[#005a6a] transition-colors"
            >
              Ladda upp ditt första dokument
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(doc.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{formatDate(doc.uploaded_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusBadge(doc.status)}
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Ladda ner"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Ta bort"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ladda upp dokument</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dokumenttyp</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#006B7D] focus:ring-1 focus:ring-[#006B7D] outline-none"
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-[#006B7D] bg-[#006B7D]/5' : 'border-gray-300'
                }`}
              >
                <Upload size={32} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  Dra och släpp din fil här, eller
                </p>
                <label className="cursor-pointer">
                  <span className="text-[#006B7D] hover:text-[#005a6a] font-medium">
                    bläddra efter fil
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, DOC, DOCX, JPG eller PNG (max 10 MB)
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
