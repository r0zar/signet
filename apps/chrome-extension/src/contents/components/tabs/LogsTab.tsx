/**
 * LogsTab - Displays the system message log and any errors
 */

import { useSignetContext } from '~shared/context/SignetContext';
import MessageLog from '~shared/ui/MessageLog';
import { colors } from '../../../shared/styles/theme';

export function LogsTab() {
  const { messages, error } = useSignetContext();

  return (
    <div style={{ height: '290px' }}>
      <MessageLog
        messages={messages}
        expanded={true}
        onToggleExpand={() => {}}
      />
      {error && (
        <div style={{
          padding: '8px',
          marginTop: '8px',
          background: 'rgba(255, 78, 78, 0.1)',
          border: '1px solid rgba(255, 78, 78, 0.3)',
          borderRadius: '4px',
          color: '#FF4E4E'
        }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}