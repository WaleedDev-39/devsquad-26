"use client";

interface TableRendererProps {
  data: Record<string, any>[];
}

export default function TableRenderer({ data }: TableRendererProps) {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  // Format cell values nicely
  const formatCell = (val: any): string => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'number') {
      // Round floats to 2 decimal places
      return Number.isInteger(val) ? val.toString() : val.toFixed(2);
    }
    return String(val);
  };

  // Format header labels
  const formatHeader = (key: string): string =>
    key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();

  // Detect if a column is numeric for alignment
  const isNumericCol = (key: string) =>
    data.every((row) => typeof row[key] === 'number' || row[key] === null);

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '40px', textAlign: 'center' }}>#</th>
            {headers.map((h) => (
              <th
                key={h}
                style={{ textAlign: isNumericCol(h) ? 'right' : 'left' }}
              >
                {formatHeader(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td className="rank-cell" style={{ textAlign: 'center' }}>
                {idx + 1}
              </td>
              {headers.map((h) => (
                <td
                  key={h}
                  style={{ textAlign: isNumericCol(h) ? 'right' : 'left' }}
                >
                  {formatCell(row[h])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
