module.exports = Metadata = {
    generateWithOwner: (owner) => {
        return {
            owner: owner._id,
            created: new Date()
        }
    }
}
