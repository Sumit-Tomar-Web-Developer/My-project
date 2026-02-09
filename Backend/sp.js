import sequelize from './config/connectionDB.js';

// Define your stored procedure name
const storedProcedureName = 'prcPropertyDetails';

// Define your parameters
const wardNo = '1';
const mode = '1';
const searchText = '';

// Call the stored procedure
sequelize
  .query(`CALL ${storedProcedureName}(:WardNo, :Mode, :SearchText)`, {
    replacements: { WardNo: wardNo, Mode: mode, SearchText: searchText },
    type: sequelize.QueryTypes.RAW,
  })
  .then(([results, metadata]) => {
    console.log(results.json);
    console.log(results.OwnerID);
  })
  .catch((error) => {
    console.error('Error calling stored procedure:', error);
  });

// // Define your stored procedure name
// const storedProcedureName = 'your_stored_procedure_name';

// // Call the stored procedure
// sequelize
//   .query(`CALL ${storedProcedureName}()`)
//   .then(([results, metadata]) => {
//     // Handle the results returned by the stored procedure
//     console.log(results);
//   })
//   .catch((error) => {
//     // Handle any errors that occur during the query
//     console.error('Error calling stored procedure:', error);
//   });
