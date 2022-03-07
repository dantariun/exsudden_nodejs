const camelToUnder = (v)=> {
    if (typeof v == "string") {
        return v.replace(/([a-z])([A-Z])/,"$1_$2").toUpperCase()    
    } else {
        return v
    }
    
}

module.exports = {
    camelToUnder
}