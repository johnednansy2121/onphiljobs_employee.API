module.exports = Response = {
    Error: {
        NOT_IMPLEMENTED: (res) => { return res.status(501).json({ http_code: '501', type: 'HTTP_NOT_IMPLEMENTED', friendly: 'Sorry, this feature is not yet implemented.', success: false })} ,
        UNAUTHORIZED: (res) => { return res.status(401).json({ http_code: '401', type: 'HTTP_UNAUTHORIZED', friendly: 'Sorry, You are unauthorized to make this request.', success: false}) },

        Custom: (res, message) => {
            return res.status(400).json({ message, success: false })
        }
    },
    Success: {
        SUCCESS: { http_code: '200', type: 'HTTP_OK', friendly: '', success: true },
        CREATED: { http_code: '201', type: 'HTTP_CREATED', friendly: 'New resource has been created', success: true },

        //Use this when the success is not a standard 200 and needs a custom message and optional return data
        Custom: function (message, object) {
            return {  message, model: object, success: true }
        }
    }
}
