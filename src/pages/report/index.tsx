import { useState } from 'react';
import { Button } from '@/components/common/Button';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';
import { v4 as uuidv4 } from 'uuid';

export const PageContainer = styled.div`
    padding: ${themeColors.spacing.xl};
    background-color: ${themeColors.dark.background};
`;

export const ReportHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${themeColors.spacing.xl};

    h1 {
        font-size: ${themeColors.typography.headings.desktop.h3.fontSize}px;
        color: ${themeColors.dark.text};
        margin: 0;
    }
`;

export const ReportTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: ${themeColors.dark.cardBackground};
    border-radius: ${themeColors.cardBorder.lg};
    overflow: hidden;
    box-shadow: ${themeColors.shadows.md};

    th,
    td {
        padding: ${themeColors.spacing.md} ${themeColors.spacing.lg};
        text-align: left;
        border-bottom: 1px solid ${themeColors.dark.border};
    }

    th {
        background-color: ${themeColors.dark.surfaceSecondary};
        color: ${themeColors.dark.text};
        font-weight: 600;
    }

    td {
        color: ${themeColors.dark.textSecondary};
    }

    tbody tr:last-child td {
        border-bottom: none;
    }

    tbody tr:hover {
        background-color: ${themeColors.dark.surface};
    }
`;

export const ReportActions = styled.div`
    display: flex;
    gap: ${themeColors.spacing.sm};
`;

type Report = {
    id: string;
    name: string;
    date: string;
};

const initialMockReports: Report[] = [
    { id: '1', name: 'Sales Report Q1 2024', date: '2024-03-31' },
    { id: '2', name: 'User Engagement Summary', date: '2024-04-15' },
    { id: '3', name: 'Inventory Report May 2024', date: '2024-05-20' },
];

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>(initialMockReports);
    const [loading, setLoading] = useState(false);

    const handleGenerateReport = () => {
        setLoading(true);
        console.log('Generating new report...');
        const newReport: Report = {
            id: uuidv4(),
            name: `Generated Report ${new Date().toLocaleDateString()}`,
            date: new Date().toISOString().split('T')[0],
        };
        setReports((prevReports) => [...prevReports, newReport]);
    };

    return (
        <PageContainer>
            <ReportHeader>
                <h1>Reports</h1>
                <Button variant="primary" onClick={handleGenerateReport} disabled={loading}>
                    {loading ? 'Generating...' : 'Generate New Report'}
                </Button>
            </ReportHeader>

            <ReportTable>
                <thead>
                    <tr>
                        <th>Report Name</th>
                        <th>Date Generated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report.id}>
                            <td>{report.name}</td>
                            <td>{report.date}</td>
                            <td>
                                <Button variant="secondary" size="sm">
                                    Download
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </ReportTable>
        </PageContainer>
    );
}
