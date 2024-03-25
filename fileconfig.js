exports.configscreen = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    port: Number(process.env.PORTSQL),
    database: process.env.DB_DATABASE,
    authentication: {
      type: "default",
    },
    options: {
      encrypt: false,
      trustServerCertificate: true,
      cryptoCredentialsDetails: {
        minVersion: "TLSv1",
      },
    },
  };
exports.config_bcsl = {
    user: process.env.DB_USER_bcsl,
    password: process.env.DB_PASS_bcsl,
    server: process.env.DB_SERVER_bcsl,
    port: Number(process.env.PORTSQL_bcsl),
    database: process.env.DB_DATABASE_bcsl,
    authentication: {
      type: "default",
    },
    options: {
      encrypt: false,
      trustServerCertificate: true,
      cryptoCredentialsDetails: {
        minVersion: "TLSv1",
      },
    },
  };
exports.config_erp = {
    user: process.env.DB_USER_erp,
    password: process.env.DB_PASS_erp,
    server: process.env.DB_SERVER_erp,
    port: Number(process.env.PORTSQL_erp),
    database: process.env.DB_DATABASE_erp,
    authentication: {
      type: "default",
    },
    options: {
      encrypt: false,
      trustServerCertificate: true,
      cryptoCredentialsDetails: {
        minVersion: "TLSv1",
      },
    },
  };
exports.config_mescc = {
    user: process.env.DB_USER_mescc,
    password: process.env.DB_PASS_mescc,
    server: process.env.DB_SERVER_mescc,
    port: Number(process.env.PORTSQL_mescc),
    database: process.env.DB_DATABASE_mescc,
    authentication: {
      type: "default",
    },
    options: {
      encrypt: false,
      trustServerCertificate: true,
      cryptoCredentialsDetails: {
        minVersion: "TLSv1",
      },
    },
  };
exports.config_hris = {
    user: process.env.DB_USER_hris,
    password: process.env.DB_PASS_hris,
    server: process.env.DB_SERVER_hris,
    port: Number(process.env.PORTSQL_hris),
    database: process.env.DB_DATABASE_hris,
    authentication: {
      type: "default",
    },
    options: {
      encrypt: false,
      trustServerCertificate: true,
      cryptoCredentialsDetails: {
        minVersion: "TLSv1",
      },
    },
  };