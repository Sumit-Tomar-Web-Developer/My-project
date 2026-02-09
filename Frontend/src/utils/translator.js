// import React from 'react'

// const translateText = (word) => {
//     const languagePair = 'en|mr';
//     let resultList = [];
//     let url = `http://www.google.com/transliterate/indic?tlqt=1&langpair=${languagePair}&text=${word}&tl_app=3`;

//     return fetch(url)
//       .then(response => response.json())
//       .then(data => {
//         data.forEach(dict => {
//           let ew = dict.ew;
//           let hws = dict.hws;
//           if (hws && hws.length > 0) {
//             hws.forEach(op => {
//               let output = op.toString();
//               if (output.includes('_')) {
//                 output = output.replace('_', ',');
//                 resultList.push(output);
//               } else {
//                 resultList.push(output);
//               }
//             });
//           } else {
//             resultList.push(ew[0].toString());
//           }
//         });

//         let firstOpt = resultList[0].toString();
//         return firstOpt;
//       })
//       .catch(error => {
//         throw new Error('An error occurred while translating the text.');
//       });
//   };

//   export default translateText;
const translateText = async (text) => {
  const languagePair = 'en|mr';

  // Split into words + symbols (keeps punctuation)
  const chunks = text.match(/[a-zA-Z]+|\d+|[^a-zA-Z\d]+/g);

  let results = [];

  for (let chunk of chunks) {
    // If chunk is English letters → transliterate
    if (/^[a-zA-Z]+$/.test(chunk)) {
      const url = `https://www.google.com/transliterate/indic?tlqt=1&langpair=${languagePair}&text=${chunk}&tl_app=3`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        results.push(data[0].hws?.[0] || chunk);
      } catch {
        results.push(chunk);
      }
    } else {
      // Symbols and punctuation → keep same
      results.push(chunk);
    }
  }

  return results.join('');
};

export default translateText;
