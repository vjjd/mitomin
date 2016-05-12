module.exports = {
    port: 3000,
    uploads: `${__dirname}/uploads`,

    redis: {
        host: 'localhost',
        port: 6379,
        auth: false
    },

    bwa: 'bwa',
    RSRS: `${__dirname}/public/RSRS/RSRS.fa`
};