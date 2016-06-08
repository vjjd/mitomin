module.exports = {
    port: 3000,
    uploads: `${__dirname}/uploads`,
    resultsFolder: `${__dirname}/public/results`,
    archivesFolder: `${__dirname}/public/archives`,
    heteroplasmyR :`${__dirname}/library/heteroplasmy.R`,
    
    redis: {
        host: 'localhost',
        port: 6379,
        auth: false
    },

    bwa: 'bwa',
    RSRS: `${__dirname}/public/RSRS/RSRS.fa`
};