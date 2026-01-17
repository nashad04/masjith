import { Eye, Check, X, Printer, XCircle, FileSpreadsheet, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { utils, writeFile } from 'xlsx';
import html2pdf from 'html2pdf.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { familySubmissionsData } from '../../data/adminData'; // Keep for fallback or initialization
import mosqeLogo from '../../assets/mosqe.jpeg';

const ViewFamilySubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    useEffect(() => {
        // Load from LocalStorage
        const savedSubmissions = JSON.parse(localStorage.getItem('familySubmissions') || '[]');
        setSubmissions(savedSubmissions);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('printable-content');
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `Family_Submission_${selectedSubmission.houseId || 'Doc'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Clone the element to avoid modifying the visible DOM during PDF generation if needed, 
        // but html2pdf handles it well. We might need to handle the toolbar hidden visibility though.
        // The 'printable-content' ID includes the toolbar? No, let's check.
        // The #printable-content div includes the toolbar div (lines 99-116 in original).
        // Wait, looking at lines 96-end in original... 
        // My previous edit made #printable-content the container.
        // The toolbar is INSIDE #printable-content.
        // We probably DON'T want the toolbar in the PDF.
        // Solution: Create a temporary clone or select the inner content div.

        // Let's target the inner content div specifically or hide toolbar via CSS class 'print:hidden' 
        // html2pdf might respect print css? No, it uses html2canvas. 
        // We should target the "Document Layout" div (line 119 in original).
        // Let's modify the JSX to give the Document Layout an ID too, or just use class selector.

        // Actually, easiest is to target the div with ID 'doc-layout' (I will add it).

        html2pdf().set(opt).from(element).save();

        // Note: html2pdf snapshots what is visible. The toolbar has 'print:hidden'. 
        // html2pdf does NOT inherently see 'print' media styles unless configured or if we use specific methods.
        // A better approach is to target the specific content container.
        // I will add ID 'submission-document-body' to the content div (around line 119).
    };

    // ... (rest of export logic)

    const handleExportExcel = () => {
        if (submissions.length === 0) return;

        // Map data to a cleaner format for Excel
        const dataToExport = submissions.map(sub => ({
            'House ID': sub.houseId,
            'Date': sub.date,
            'Head of Family': sub.headName || sub.headOfFamily,
            'NIC': sub.nic,
            'Contact': sub.contact || sub.phone,
            'Address': sub.address,
            'Residency': sub.residency,
            'Members Count': Array.isArray(sub.members) ? sub.members.length : sub.members,
            'Submitted At': sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : ''
        }));

        // Create workbook and worksheet
        const wb = utils.book_new();
        const ws = utils.json_to_sheet(dataToExport);

        // Auto-adjust column widths (basic approximation)
        const colWidths = [
            { wch: 10 }, // House ID
            { wch: 12 }, // Date
            { wch: 20 }, // Head Name
            { wch: 15 }, // NIC
            { wch: 15 }, // Contact
            { wch: 30 }, // Address
            { wch: 10 }, // Residency
            { wch: 10 }, // Count
            { wch: 15 }  // Submitted At
        ];
        ws['!cols'] = colWidths;

        utils.book_append_sheet(wb, ws, 'Family Submissions');

        // Generate file name with date
        const dateStr = new Date().toISOString().split('T')[0];
        writeFile(wb, `Masjid_Family_Submissions_${dateStr}.xlsx`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Family Registration Submissions</h2>
                <button
                    onClick={handleExportExcel}
                    disabled={submissions.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileSpreadsheet size={18} />
                    Convert to Excel
                </button>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Head of Family</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead className="text-center">Members</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No submissions found.
                                    <br />
                                    <span className="text-sm font-normal">Go to Family Registration page to submit data.</span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            submissions.map((submission) => (
                                <TableRow key={submission.id}>
                                    <TableCell>
                                        <div className="font-medium text-gray-900">{submission.headName || submission.headOfFamily}</div>
                                        <div className="text-sm text-gray-500">{submission.address}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p>{submission.contact || submission.phone}</p>
                                            <p className="text-gray-400 text-xs">{submission.nic ? `NIC: ${submission.nic}` : ''}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-islamic-green rounded-full">
                                            {submission.members ? (Array.isArray(submission.members) ? submission.members.length : submission.members) : 0}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedSubmission(submission)}
                                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                                                title="View & Print"
                                            >
                                                <Printer className="w-3.5 h-3.5" />
                                                View & Print
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Printable Modal Overlay */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:p-0 print:bg-white print:absolute print:inset-0 modal-overlay fa-print-modal">

                    {/* Modal Content - Styled as the Document */}
                    <div id="printable-content" className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto print:shadow-none print:w-full print:max-w-none print:h-auto print:max-h-none print:rounded-none">

                        {/* Toolbar (Hidden in Print) */}
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center print:hidden z-10" data-html2canvas-ignore="true">
                            <h3 className="font-bold text-lg">Submission Details</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        // Specific handler for PDF download
                                        const element = document.getElementById('document-body');
                                        const opt = {
                                            margin: 10,
                                            filename: `Family_Submission_${selectedSubmission.houseId || 'Doc'}.pdf`,
                                            image: { type: 'jpeg', quality: 0.98 },
                                            html2canvas: { scale: 2, useCORS: true },
                                            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                                        };
                                        html2pdf().set(opt).from(element).save();
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                                >
                                    <Download size={16} />
                                    Save PDF
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                                >
                                    <Printer size={16} />
                                    Print
                                </button>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Document Layout (Printable Area) */}
                        <div id="document-body" className="p-8 md:p-12 print:p-0 print:m-0 font-serif text-slate-800">

                            {/* Document Header */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b-2 border-slate-800 pb-6">
                                <div className="w-24 h-24 flex items-center justify-center">
                                    <img src={mosqeLogo} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <div className="text-center flex-grow">
                                    <h1 className="text-2xl font-bold mb-2">மஸ்ஜித் அல் தக்வா</h1>
                                    <h2 className="text-xl font-bold text-slate-600">குடும்பத் தகவல் படிவம்</h2>
                                </div>
                            </div>
                            {/* ... (Rest of content same) */}
                            {/* Meta Info */}
                            <div className="flex justify-between mb-8 text-sm">
                                <div className="flex gap-2">
                                    <span className="font-bold">வீட்டு அடையாள எண்:</span>
                                    <span className="min-w-[100px] border-b border-dotted border-slate-400 px-2">{selectedSubmission.houseId}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold">திகதி:</span>
                                    <span className="min-w-[100px] border-b border-dotted border-slate-400 px-2">{selectedSubmission.date}</span>
                                </div>
                            </div>

                            {/* Part 1 Header */}
                            <div className="bg-blue-100 py-1 px-4 mb-4 border border-blue-200 text-center font-bold">
                                பகுதி 1: குடும்பத் தலைவரின் விபரங்கள்
                            </div>

                            {/* Part 1 Details */}
                            <div className="space-y-4 mb-8 text-sm">
                                <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
                                    <div className="font-semibold">முழுப் பெயர் :</div>
                                    <div className="border-b border-slate-300 pb-1">{selectedSubmission.headName || selectedSubmission.headOfFamily}</div>
                                </div>
                                <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
                                    <div className="font-semibold">தேசிய அடையாள அட்டை எண் :</div>
                                    <div className="border-b border-slate-300 pb-1">{selectedSubmission.nic}</div>
                                </div>
                                <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
                                    <div className="font-semibold">முதன்மைத் தொடர்பு இலக்கம் :</div>
                                    <div className="border-b border-slate-300 pb-1">{selectedSubmission.contact || selectedSubmission.phone}</div>
                                </div>
                                <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
                                    <div className="font-semibold pt-1">முகவரி :</div>
                                    <div className="border-b border-slate-300 pb-1 min-h-[40px]">{selectedSubmission.address}</div>
                                </div>
                                <div className="flex gap-8 mt-4">
                                    <div className="font-semibold">வீட்டு உரிமை நிலை :</div>
                                    <div className="flex gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 border border-black flex items-center justify-center`}>
                                                {selectedSubmission.residency === 'Own' && <Check size={12} />}
                                            </div>
                                            <span>சொந்த வீடு</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 border border-black flex items-center justify-center`}>
                                                {selectedSubmission.residency === 'Rent' && <Check size={12} />}
                                            </div>
                                            <span>வாடகை வீடு</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Part 2 Header */}
                            <div className="bg-blue-100 py-1 px-4 mb-4 border border-blue-200 text-center font-bold">
                                பகுதி 2: குடும்ப உறுப்பினர்களின் விபரங்கள்
                            </div>

                            {/* Members Table */}
                            <table className="w-full border-collapse border border-slate-800 text-sm mb-12">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="border border-slate-800 p-2 w-10 text-center">இல</th>
                                        <th className="border border-slate-800 p-2 text-left">பெயர்</th>
                                        <th className="border border-slate-800 p-2 w-32 text-center">உறவு முறை</th>
                                        <th className="border border-slate-800 p-2 w-16 text-center">வயது</th>
                                        <th className="border border-slate-800 p-2 w-40 text-center">தொழில்</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(selectedSubmission.members) ? (
                                        selectedSubmission.members.map((member, index) => (
                                            <tr key={index}>
                                                <td className="border border-slate-800 p-2 text-center">{index + 1}</td>
                                                <td className="border border-slate-800 p-2">{member.name}</td>
                                                <td className="border border-slate-800 p-2 text-center">{member.relation}</td>
                                                <td className="border border-slate-800 p-2 text-center">{member.age}</td>
                                                <td className="border border-slate-800 p-2">{member.job}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="border border-slate-800 p-2 text-center">1</td>
                                            <td className="border border-slate-800 p-2">Members count: {selectedSubmission.members}</td>
                                            <td colSpan={3} className="border border-slate-800 p-2 text-center text-gray-500 italic">Details not available in mock data</td>
                                        </tr>
                                    )}
                                    {/* Fill empty rows for layout if needed */}
                                    {selectedSubmission.members && selectedSubmission.members.length < 5 && Array(5 - selectedSubmission.members.length).fill(0).map((_, i) => (
                                        <tr key={`empty-${i}`}>
                                            <td className="border border-slate-800 p-4"></td>
                                            <td className="border border-slate-800 p-4"></td>
                                            <td className="border border-slate-800 p-4"></td>
                                            <td className="border border-slate-800 p-4"></td>
                                            <td className="border border-slate-800 p-4"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Signature */}
                            <div className="mt-16 flex justify-end">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-64 border-b border-dashed border-slate-400"></div>
                                    <div className="text-sm font-bold">குடும்பத் தலைவரின் கையொப்பம்</div>
                                </div>
                            </div>

                            {/* Print Footer */}
                            <div className="mt-8 text-center text-xs text-gray-400 hidden print:block">
                                Generated by Masjid Al-Taqwa Admin System - {new Date().toLocaleDateString()}
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Print Styles Global Override */}
            <style>{`
                @media print {
                    body {
                        visibility: hidden;
                    }
                    .fa-print-modal, .fa-print-modal * {
                        visibility: visible;
                    }
                    .fa-print-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: white;
                        padding: 0;
                        margin: 0;
                        z-index: 9999;
                        overflow: visible;
                    }
                    #printable-content {
                        box-shadow: none;
                        max-width: nonebox;
                        width: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                    /* Hide scrollbars and toolbars */
                    ::-webkit-scrollbar { display: none; }
                }
            `}</style>
        </div>
    );
};
export default ViewFamilySubmissions;
