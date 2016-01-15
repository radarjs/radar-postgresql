module.exports = {


  friendlyName: 'Begin transaction',


  description: 'Begins a transaction',


  cacheable: false,


  sync: false,


  inputs: {

    connection: {
      description: 'An open postgres connection',
      example: '==='
    }

  },


  exits: {

    success: {
      variableName: 'result',
      description: 'Done.',
    },

  },


  fn: function(inputs, exits) {
    var Postgres = require('machinepack-postgresql');

    Postgres.runQuery({
      connection: inputs.connection.client,
      query: 'BEGIN'
    }).exec({
      error: function(err) {
        console.log(err);
        exits.error(err);
      },
      success: function() {
        exits.success();
      }
    });
  },


};
