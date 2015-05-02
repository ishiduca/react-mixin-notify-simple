'use strict'
var merge      = require('deepmerge')
var assign     = require('object-assign')
var _semaphore = require('./semaphore')

var _mixin = {
    getMessage :       getMessage
  , getStyle   :       getStyle
  , clearMessage:      clearMessage
  , getInitialState:   getDefault
  , componentDidMount: semaphoreSetup
}

function getMessage () { return this.state.message }

function getStyle () {
    var msg    = this.getMessage()
    var type   = msg ? /error/i.test(msg) ? 'error' : 'info' : 'none'
    var styles = this.props.styles
    return type === 'none' ? styles.none : merge(styles.base, styles[type])
}

function clearMessage (ev) { this.semaphore.empty() }

function getDefault () { return {message: '' } }

function semaphoreSetup () {
    var me = this
    this.semaphore = _semaphore({timeout: this.props.timeout})
    this.semaphore.on('data', function (data) {
        me.setState({message: data})
    })
    this.semaphore.on('empty', function () {
        me.setState(getDefault())
    })
}

module.exports = _mixin
