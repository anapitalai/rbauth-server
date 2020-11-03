const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')


const adminBro = new AdminBro ({
    Databases: [],
    rootPath: '/admin',
})

const buildAdminRouter=(admin)=>{
    const router=buildRouter(admin)
    return router
}

module.exports=buildAdminRouter