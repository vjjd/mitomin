module.exports = {
    tTypes: {
        upload: {
            file: {
                unhashed: 'unhashed file',
                fq: '.fq',
                fastq: '.fastq',
                sam: '.sam'
            },
            zip: 'zip'
        },

        archive: {
            unhashed: 'unhashed taskToArchive',
            hashed: 'hashed taskToArchive'
        },

        global: {
            reload: 'reload'
        }
    },
    
    tStatus: {
        unsup: 'unsupported',
        aborted: 'aborted',
        pending: 'pending',
        done: 'done'
    }
};
