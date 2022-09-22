module.exports = {
    multiply: (...args) => {
        let result = 1
        for( let i = 0; i < args.length-1; i++){
            result = result * args.at(i)
            
        }
        return result
    }
}