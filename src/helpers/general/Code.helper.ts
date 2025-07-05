import numeral from "numeral";

/**
 * Generate Format
 * @param number_of_characters
 */
const GetFormat = (number_of_characters: number) => {
  let format: string = "";
  for (let i = 0; i < number_of_characters; i++) {
    format += "0";
  }
  return format;
};

/**
 * Custom Code Generator
 * @param prefix                Prefix
 * @param number_of_characters  Number of Characters for the Numerical Section
 * @param current_value         Current Value
 */
export const CodeGenerator = (
  prefix: string,
  number_of_characters: number,
  current_value: number
) => {
  return (
    prefix + numeral(current_value + 1).format(GetFormat(number_of_characters))
  );
};
/**
 * Random String Generator
 * @param length                Prefix
 */
export const RandomStringGenerator = (length: number) => {
  var randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
};

export const ConvertToPascalCase = (word: string) =>
  word.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());

export const ConvertToSnakeCase = (name: string): string =>
  name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
