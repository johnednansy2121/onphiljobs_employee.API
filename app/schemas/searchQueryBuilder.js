const { createFilter } = require('odata-v4-mongodb')

module.exports = ({$filter, $pageNum, $pageSize, $orderBy}) => {
    let filter = {}
    let pageNum = 1
    let pageSize = 20
    let orderBy  = {}
   
    if($filter !== '' && $filter !== null && $filter !== undefined)
        filter = createFilter($filter)
    else {
        filter = {}
    }
    if($pageNum !== '' && $pageNum !== null && $pageNum !== undefined)
        pageNum = parseFloat($pageNum)    
    if($pageSize !== '' && $pageSize !== null && $pageSize !== undefined)
        pageSize = parseFloat($pageSize)
    if($orderBy !== ''  && $orderBy !== null && $orderBy !== undefined) {
        const orders = $orderBy.split(',')
        orders.forEach((order) => {
            const orderSplit = order.split(' ')

            orderBy[orderSplit[0]] = orderSplit[1].toLowerCase() === 'asc' ? 1 : -1
        })
    } else {
        orderBy = null
    }

    return {
        filter,
        pageNum,
        pageSize,
        orderBy
    }
}