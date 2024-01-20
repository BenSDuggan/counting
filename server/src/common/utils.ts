

// Get current epoch time in ms
export const epoch = ():number => new Date().valueOf();

// Are all elements in an array equal?
export const all_equal = (arr:string[]):boolean => arr.every( v => v === arr[0])

