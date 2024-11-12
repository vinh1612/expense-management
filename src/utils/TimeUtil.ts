import { format, parse } from 'date-fns'
import { vi } from 'date-fns/locale'

export const getTodayDate = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDate = (dateString: string) => {
  const date = parse(dateString, 'dd/MM/yyyy', new Date()) // Parse the string to a Date object
  const formattedDate = format(date, 'dd/MM/yyyy') // Format the date as 'dd/MM/yyyy'
  const dayOfWeek = format(date, 'EEEE', { locale: vi }) // Get the day of the week in Vietnamese

  return { formattedDate, dayOfWeek }
}

export const convertDateFormat = (
  dateString: string,
  currentFormat: string,
  desiredFormat: string
) => {
  try {
    // Parse the date using the current format
    const parsedDate = parse(dateString, currentFormat, new Date());
    // Format it to the desired format
    return format(parsedDate, desiredFormat);
  } catch (error) {
    console.error("Error converting date:", error);
    return getTodayDate();  // Return null or an error message if conversion fails
  }
};

export const parseDateString = (dateString: string) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};