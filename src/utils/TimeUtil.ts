import { format, parse } from 'date-fns'
import { vi } from 'date-fns/locale'

export const formatDate = (dateString: string) => {
    const date = parse(dateString, 'dd/MM/yyyy', new Date()) // Parse the string to a Date object
    const formattedDate = format(date, 'dd/MM/yyyy') // Format the date as 'dd/MM/yyyy'
    const dayOfWeek = format(date, 'EEEE', { locale: vi }) // Get the day of the week in Vietnamese

    return { formattedDate, dayOfWeek }
}