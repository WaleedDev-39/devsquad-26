import React from 'react';

export default function TableRenderer({ data }: { data: string }) {
  let parsedData: any[] = [];
  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    return <div>{data}</div>;
  }

  if (!Array.isArray(parsedData) || parsedData.length === 0) {
    return <div>No data available</div>;
  }

  const columns = Object.keys(parsedData[0]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
        marginTop: '0.5rem'
      }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            {columns.map((col) => (
              <th key={col} style={{
                padding: '0.75rem',
                textAlign: 'left',
                borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                textTransform: 'capitalize',
                color: 'var(--accent)'
              }}>
                {col.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parsedData.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              {columns.map((col) => (
                <td key={col} style={{ padding: '0.75rem' }}>
                  {row[col] !== null ? String(row[col]) : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
