export const Capitalize = str => str.toLowerCase().trim().replace(/(^\w| \w)/igm, x => x.toUpperCase());
export const SnakeCase = (str, delimeter = '-') => str.toLowerCase().trim().replace(/ /gm, delimeter);
export const HashCode = str => String(str).split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0)