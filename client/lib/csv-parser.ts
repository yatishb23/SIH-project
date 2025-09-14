import Papa from 'papaparse';

/**
 * A generic CSV parsing function that returns data and errors.
 * It automatically uses the first row as headers for the JSON keys.
 * @param csvText The raw string content from the .csv file.
 * @returns An object containing the parsed data and any parsing errors.
 */
function parseCSV(csvText: string) {
  const result = Papa.parse(csvText, {
    header: true,        // Treats the first row as headers
    skipEmptyLines: true,// Ignores empty lines
    dynamicTyping: true, // Automatically converts numbers and booleans
  });

  return {
    data: result.data,
    errors: result.errors,
    skipped: 0, // PapaParse includes this in its own way if needed
  };
}

// Export specific functions that match the names used in your component
export function parseStudentCSV(csvText: string) {
  return parseCSV(csvText);
}

export function parseAttendanceCSV(csvText: string) {
  return parseCSV(csvText);
}

export function parseAssessmentCSV(csvText: string) {
  return parseCSV(csvText);
}