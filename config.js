module.exports = {
    port: 9000,
    debug: true,
    cors: true,
    mongoConnection: "mongodb://mongo:27017/parquidigital",
    jwt: {
        secret: 'MySuperSecretKey_replaceThis_XD',
        salt: '$2b$10$Wr7GozFYFiJDAAPxW63VZu'
    }
}