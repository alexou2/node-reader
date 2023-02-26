let encodedParam = 'Chapter%2020_%20Ju%lio%20100%';
const modifiedString = encodedParam.replace(/%([^%]*)$/, '%25');
console.log(decodeURIComponent(modifiedString))