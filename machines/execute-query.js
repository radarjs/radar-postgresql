module.exports = {


  friendlyName: 'Execute query',


  description: 'Executes a Radar query',


  cacheable: false,


  sync: false,


  inputs: {

    query: {
      description: 'The Radar query to run',
      example: {},
      required: true
    },

    connectionString: {
      description: 'An optional connection string to use to connect to postgres',
      example: 'postgres://localhost:5432/radar'
    },

    connection: {
      description: 'An optional postgres client to use for running the query',
      example: '==='
    }

  },


  exits: {

    success: {
      variableName: 'result',
      description: 'The query results',
      example: []
    },

    missingConnectionInfo: {
      description: 'No information was given to create a connection. A connectionString or connection object must be used.'
    }

  },


  fn: function(inputs, exits) {

    var SQLBuilder = require('machinepack-sql-builder');
    var Postgres = require('machinepack-postgresql');

    var query = inputs.query;

    // Ensure there is either a connection string or a connection object that
    // we can use to run the query.
    if(!inputs.connectionString && !inputs.connection) {
      return exits.missingConnectionInfo();
    }

    SQLBuilder.generateSql({
      dialect: 'postgres',
      query: query
    }).exec({
      error: function(err) {
        return exits.error(err);
      },
      success: function(sql) {

        // If there is a connection string, open a new connection to run the
        // query with.
        if(inputs.connectionString) {
          Postgres.getConnection({
            connectionString: inputs.connectionString
          }).exec({
            error: function(err) {
              return exits.error(err);
            },
            success: function(conn) {

              // Run the query
              Postgres.runQuery({
                connection: conn.client,
                query: sql
              }).exec({
                error: function(err) {
                  return exits.error(err);
                },
                success: function(data) {
                  // Release the connection
                  Postgres.releaseConnection({
                    release: conn.release
                  }).exec({
                    error: function(err) {
                      return exits.error(err);
                    },
                    success: function() {
                      exits.success(data);
                    }
                  });
                }
              });
            }
          });
        }

        // Otherwise use the provided connection
        else {
          // Run the query
          Postgres.runQuery({
            connection: inputs.connection.client,
            query: sql
          }).exec({
            error: function(err) {
              return exits.error(err);
            },
            success: function(data) {
              exits.success(data);
            }
          });
        }

      }
    });

  },



};
