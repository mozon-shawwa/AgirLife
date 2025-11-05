
const returnJson = (res,statusCode,status,data,message)=>{
    return res.status(statusCode).json({
        status:{
           status: status,
           message: message
        },
        data: data
    })

}

module.exports = {returnJson};