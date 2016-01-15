module.exports = {


  friendlyName: 'Get connection',


  description: 'Gets an open Postgres connection',


  cacheable: false,


  sync: false,


  inputs: {

    connectionString: {
      description: 'A connection string to use to connect to postgres',
      example: 'postgres://localhost:5432/radar',
      required: true
    }

  },


  exits: {

    success: {
      variableName: 'result',
      description: 'An open postgres connection',
      example: {
        client: '===',
        release: '==='
      }
    },

  },


  fn: function(inputs, exits) {

    var Postgres = require('machinepack-postgresql');

    Postgres.getConnection({
      connectionString: inputs.connectionString
    }).exec({
      error: function(err) {
        return exits.error(err);
      },
      success: function(conn) {
        exits.success(conn);
      }
    });
  },

};
