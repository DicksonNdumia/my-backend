//writing my own middleware
export const myLogger = function(req,res,next) {
    console.log('LOGGED')
    next()
}

