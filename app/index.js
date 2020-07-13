const express = require('express')
const bootable = require('bootable')
require('dotenv').config()
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./swagger')
const { subscriptionEvent } = require('./configurations/event')
global.basedir = __dirname

const app = bootable(express())

app.phase(bootable.initializers(__dirname + '/configurations'))
app.phase(bootable.initializers(__dirname + '/models'))
app.phase(bootable.initializers(__dirname + '/services'))
app.phase(bootable.initializers(__dirname + '/api/v1'))

app.boot((err) => {
    if(err) {
        console.log(err)
    }
    app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
    app.get('/', (req, res) => {
        res.redirect('/swagger')
    })
    app.get('/healthcheck', (req, res) => {
        res.status(200).json('This is healthy.')
    })

    subscriptionEvent()
    
    app.listen(process.env.PORT || 3000, () => {
        console.log(`
======================================================
FLLAIR API IS RUNNING NOW . . . .. . .
======================================================
        `)
    })
})
