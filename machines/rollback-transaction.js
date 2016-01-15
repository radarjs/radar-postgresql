module.exports = {


  friendlyName: 'Rollback transaction',


  description: 'Rollsback a transaction',


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
      query: 'ROLLBACK'
    }).exec({
      error: function() {
        Postgres.releaseConnection({
          release: inputs.connection.release
        }).exec({
          error: function(err) {
            exits.error(err);
          },
          success: function() {
            exits.success();
          }
        });
      },
      success: function() {
        Postgres.releaseConnection({
          release: inputs.connection.release
        }).exec({
          error: function(err) {
            exits.error(err);
          },
          success: function() {
            exits.success();
          }
        });
      }
    });

    return exits.success();
  },

};
