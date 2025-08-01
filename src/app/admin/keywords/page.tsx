'use client';

import { useState, useEffect } from 'react';
import { getStoredKeywords, removeKeyword, resetToDefaults } from '@/lib/keywordStorage';
import { 
  getKeywordsByCategory, 
  validateKeywordMapping, 
  getKeywordStats,
  getAvailableBlogUrls
} from '@/lib/keywordManager';
import { 
  importKeywordsFromFile, 
  mergeKeywordsFromFile, 
  exportKeywordsToFile, 
  generateTemplateFile,
  mergeKeywordsAndGenerateCode
} from '@/lib/keywordFileManager';

export default function KeywordsAdminPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stats, setStats] = useState<any>(null);
  const [validation, setValidation] = useState<any>(null);
  const [addMessage, setAddMessage] = useState('');
  const [keywords, setKeywords] = useState<Record<string, string>>({});
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadMode, setUploadMode] = useState<'replace' | 'merge'>('merge');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [codeUpdate, setCodeUpdate] = useState<string>('');
  const [showCodeUpdate, setShowCodeUpdate] = useState(false);

  const categories = ['All', 'SEO', 'Web Development', 'Mobile Apps', 'Digital Marketing', 'General'];

  useEffect(() => {
    setKeywords(getStoredKeywords());
    setStats(getKeywordStats());
    setValidation(validateKeywordMapping());
  }, []);

  const filteredKeywords = selectedCategory === 'All' 
    ? Object.entries(keywords)
    : getKeywordsByCategory(selectedCategory).map(k => [k.keyword, k.url]);



  const handleRemoveKeyword = (keyword: string) => {
    const success = removeKeyword(keyword);
    
    if (success) {
      setAddMessage('Keyword removed successfully!');
      // Refresh keywords
      setKeywords(getStoredKeywords());
    } else {
      setAddMessage('Failed to remove keyword');
    }
  };

  const handleResetToDefaults = () => {
    resetToDefaults();
    setAddMessage('Reset to default keywords successfully!');
    // Refresh keywords
    setKeywords(getStoredKeywords());
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      setAddMessage('Please select a file first');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (uploadMode === 'replace') {
        const result = importKeywordsFromFile(content);
        setAddMessage(result.message);
        if (result.success) {
          setKeywords(getStoredKeywords());
          setSelectedFile(null);
          setShowCodeUpdate(false);
          setCodeUpdate('');
        }
      } else {
        const result = mergeKeywordsAndGenerateCode(content);
        setAddMessage(result.message);
        if (result.success) {
          setKeywords(getStoredKeywords());
          setSelectedFile(null);
          setCodeUpdate(result.codeUpdate || '');
          setShowCodeUpdate(true);
        }
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleExportCurrent = () => {
    const data = exportKeywordsToFile();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keywords-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTemplate = () => {
    const template = generateTemplateFile();
    const blob = new Blob([template], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keywords-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
                 <h1 className="text-3xl font-bold text-gray-900 mb-8">Internal Linking Keyword Manager</h1>
         
         {/* Success/Error Messages */}
         {addMessage && (
           <div className={`p-4 rounded-lg mb-6 ${
             addMessage.includes('successfully') 
               ? 'bg-green-100 text-green-800 border border-green-200' 
               : 'bg-red-100 text-red-800 border border-red-200'
           }`}>
             {addMessage}
           </div>
         )}
        
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Keywords</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalKeywords}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Avg Length</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.averageKeywordLength}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Categories</h3>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.categories).length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className={`text-2xl font-bold ${validation?.valid ? 'text-green-600' : 'text-red-600'}`}>
                {validation?.valid ? 'Valid' : 'Issues'}
              </p>
            </div>
          </div>
        )}

                 {/* File Upload Section */}
         <div className="bg-white p-6 rounded-lg shadow mb-6">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-semibold">Bulk Keyword Management</h2>
             <div className="flex gap-2">
               <button
                 onClick={handleDownloadTemplate}
                 className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
               >
                 Download Template
               </button>
               <button
                 onClick={() => setShowFileUpload(!showFileUpload)}
                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
               >
                 {showFileUpload ? 'Cancel' : 'Upload Keywords'}
               </button>
             </div>
           </div>
           
           {showFileUpload && (
             <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Upload Mode
                   </label>
                   <div className="flex gap-4">
                     <label className="flex items-center">
                       <input
                         type="radio"
                         value="merge"
                         checked={uploadMode === 'merge'}
                         onChange={(e) => setUploadMode(e.target.value as 'replace' | 'merge')}
                         className="mr-2"
                       />
                       <span className="text-sm">Merge (Add new keywords)</span>
                     </label>
                     <label className="flex items-center">
                       <input
                         type="radio"
                         value="replace"
                         checked={uploadMode === 'replace'}
                         onChange={(e) => setUploadMode(e.target.value as 'replace' | 'merge')}
                         className="mr-2"
                       />
                       <span className="text-sm">Replace (Replace all keywords)</span>
                     </label>
                   </div>
                 </div>
                                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload JSON File
                    </label>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {selectedFile && (
                      <p className="mt-2 text-sm text-green-600">
                        ✅ Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                               </div>
                
                {/* Upload Button */}
                {selectedFile && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleFileUpload}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {uploadMode === 'merge' ? 'Merge Keywords' : 'Replace Keywords'}
                    </button>
                  </div>
                )}
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Download the template file first</li>
                    <li>• Fill in your keywords and URLs</li>
                    <li>• Save as JSON file</li>
                    <li>• Select your file above</li>
                    <li>• Click the upload button to process</li>
                    <li>• <strong>Merge mode:</strong> Adds new keywords, keeps existing ones</li>
                    <li>• <strong>Replace mode:</strong> Replaces all keywords with file content</li>
                  </ul>
                                 </div>
               </div>
             )}
           </div>

           {/* Code Update Section */}
           {showCodeUpdate && codeUpdate && (
             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
               <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                 🔧 Code Update Required
               </h3>
               <p className="text-yellow-800 mb-4">
                 To make these changes permanent, you need to update your code file. 
                 Copy the code below and replace the <code className="bg-yellow-100 px-1 rounded">keywordToUrlMap</code> in <code className="bg-yellow-100 px-1 rounded">src/lib/internalLinking.ts</code>:
               </p>
               <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                 <pre className="text-sm">{codeUpdate}</pre>
               </div>
               <div className="mt-4 flex gap-2">
                 <button
                   onClick={() => {
                     navigator.clipboard.writeText(codeUpdate);
                     setAddMessage('Code copied to clipboard!');
                   }}
                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                 >
                   Copy Code
                 </button>
                 <button
                   onClick={() => setShowCodeUpdate(false)}
                   className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                 >
                   Hide
                 </button>
               </div>
             </div>
           )}

         

        {/* Category Filter */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Keywords List */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Keywords ({filteredKeywords.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredKeywords.map(([keyword, url]) => {
                  let category = 'General';
                  if (url.includes('seo')) category = 'SEO';
                  else if (url.includes('web')) category = 'Web Development';
                  else if (url.includes('mobile') || url.includes('app')) category = 'Mobile Apps';
                  else if (url.includes('marketing')) category = 'Digital Marketing';

                  return (
                    <tr key={keyword} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {keyword}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href={url} className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                          {url}
                        </a>
                      </td>
                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                           category === 'SEO' ? 'bg-green-100 text-green-800' :
                           category === 'Web Development' ? 'bg-blue-100 text-blue-800' :
                           category === 'Mobile Apps' ? 'bg-purple-100 text-purple-800' :
                           category === 'Digital Marketing' ? 'bg-orange-100 text-orange-800' :
                           'bg-gray-100 text-gray-800'
                         }`}>
                           {category}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         <button
                           onClick={() => handleRemoveKeyword(keyword)}
                           className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                         >
                           Remove
                         </button>
                       </td>
                     </tr>
                   );
                 })}
              </tbody>
            </table>
          </div>
        </div>

                 {/* Actions */}
         <div className="bg-white p-6 rounded-lg shadow mb-6">
           <h2 className="text-xl font-semibold mb-4">Actions</h2>
           <div className="flex gap-4 mb-4">
             <button
               onClick={handleExportCurrent}
               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
             >
               Export Current Keywords
             </button>
             <button
               onClick={handleResetToDefaults}
               className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
             >
               Reset to Defaults
             </button>
           </div>
         </div>

        {/* Validation Issues */}
        {validation && !validation.valid && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-4">Validation Issues</h2>
            <ul className="space-y-2">
              {validation.issues.map((issue: string, index: number) => (
                <li key={index} className="text-red-700 text-sm">• {issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 