import * as XLSX from 'xlsx';

/**
 * Parse Excel/CSV file buffer and return array of objects
 * @param {Buffer} buffer - File buffer
 * @returns {Array<Object>} - Parsed data as array of objects
 */
export function parseExcelFile(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON with header row
    const data = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        raw: false
    });

    // Normalize column names (lowercase, remove spaces)
    return data.map(row => {
        const normalizedRow = {};
        for (const [key, value] of Object.entries(row)) {
            const normalizedKey = key
                .toLowerCase()
                .replace(/\s+/g, '')
                .replace(/[^a-z0-9]/g, '');

            // Map common variations
            const keyMap = {
                'rollno': 'rollNumber',
                'rollnumber': 'rollNumber',
                'roll': 'rollNumber',
                'studentroll': 'rollNumber',
                'subjectname': 'subjectName',
                'subject': 'subjectName',
                'attendancepercent': 'attendancePercent',
                'attendance': 'attendancePercent',
                'totalclasses': 'totalClasses',
                'total': 'totalClasses',
                'attendedclasses': 'attendedClasses',
                'attended': 'attendedClasses',
                'unittest1': 'unitTest1',
                'ut1': 'unitTest1',
                'unittest2': 'unitTest2',
                'ut2': 'unitTest2',
                'unittest3': 'unitTest3',
                'ut3': 'unitTest3',
                'iatscore': 'iatScore',
                'iat': 'iatScore'
            };

            const finalKey = keyMap[normalizedKey] || normalizedKey;
            normalizedRow[finalKey] = value;
        }
        return normalizedRow;
    });
}

/**
 * Validate required columns exist in parsed data
 * @param {Array<Object>} data - Parsed data 
 * @param {Array<string>} requiredColumns - Required column names
 * @returns {Object} - { valid: boolean, missing: string[] }
 */
export function validateColumns(data, requiredColumns) {
    if (!data || data.length === 0) {
        return { valid: false, missing: requiredColumns };
    }

    const firstRow = data[0];
    const existingColumns = Object.keys(firstRow).map(k => k.toLowerCase());
    const missing = requiredColumns.filter(col =>
        !existingColumns.includes(col.toLowerCase())
    );

    return {
        valid: missing.length === 0,
        missing
    };
}
