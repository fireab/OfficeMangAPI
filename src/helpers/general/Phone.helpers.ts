/**
 * Format Phone Number
 * 
 * @param {string} phone_number 
 */
export const formatPhoneNumber = (phone_number: string): string => {
    return (phone_number ? phone_number.slice(phone_number.length - 9) : null);
}


export const isValidPhoneNumber = (phone_number: string): boolean => {
    return phone_number.startsWith('0') ? phone_number.length === 10 : phone_number.length === 9;
}