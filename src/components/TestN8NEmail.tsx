import { useState } from 'react';
import { n8nIntegrationService } from '../utils/n8nIntegrationService';
import { realTimeAuth } from '../utils/realTimeAuth';

/**
 * Test component for n8n weekly email integration
 * Add this to any page to test the email functionality
 */
export function TestN8NEmail() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [testData, setTestData] = useState<any>(null);

  const handleTest = async () => {
    const user = realTimeAuth.getCurrentUser();
    if (!user) {
      setResult('❌ User not authenticated. Please log in first.');
      return;
    }

    setLoading(true);
    setResult('🔄 Collecting your progress data...');
    setTestData(null);
    
    try {
      // First, collect the data to show what will be sent
      const progressData = await n8nIntegrationService.collectUserProgressData(user.id);
      
      if (!progressData) {
        setResult('❌ Failed to collect progress data. Check console for errors.');
        setLoading(false);
        return;
      }

      setTestData(progressData);
      setResult('📊 Data collected! Sending to n8n...');
      
      // Now send to n8n
      const success = await n8nIntegrationService.sendWeeklyProgressToN8N(user.id);
      
      if (success) {
        setResult('✅ Email sent successfully! Check your inbox in a few moments.');
      } else {
        setResult('❌ Failed to send email. Check console and n8n workflow for errors.');
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '30px', 
      maxWidth: '600px', 
      margin: '20px auto',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginTop: 0, color: '#667eea' }}>📧 Test Weekly Progress Email</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        This will collect your current progress data and send it to n8n to generate a weekly progress email.
      </p>
      
      <button 
        onClick={handleTest}
        disabled={loading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: loading ? '#999' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          marginBottom: '20px',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = '#5568d3';
          }
        }}
        onMouseOut={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = '#667eea';
          }
        }}
      >
        {loading ? '⏳ Processing...' : '🚀 Send Test Email'}
      </button>
      
      {result && (
        <div style={{
          padding: '15px',
          borderRadius: '8px',
          backgroundColor: result.includes('✅') ? '#e8f5e9' : result.includes('❌') ? '#ffebee' : '#e3f2fd',
          marginBottom: '20px',
          border: `1px solid ${result.includes('✅') ? '#4caf50' : result.includes('❌') ? '#f44336' : '#2196f3'}`
        }}>
          <p style={{ margin: 0, fontWeight: '500' }}>{result}</p>
        </div>
      )}

      {testData && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <h3 style={{ marginTop: 0, fontSize: '16px' }}>📊 Data Being Sent:</h3>
          <pre style={{
            overflow: 'auto',
            maxHeight: '300px',
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px'
          }}>
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#856404'
      }}>
        <strong>💡 Tips:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Make sure you're logged in</li>
          <li>Check your email inbox (and spam folder)</li>
          <li>Ensure n8n workflow is active</li>
          <li>Check browser console for detailed logs</li>
        </ul>
      </div>
    </div>
  );
}

