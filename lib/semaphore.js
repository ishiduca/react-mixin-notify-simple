'use strict'
var events = require('events')
var merge  = require('deepmerge')
var assign = require('object-assign')

function write (data) {
    if (null === data || 'undefined' === typeof data) return false
    ;(this._buffer || (this._buffer = [])).push(data)
    this.lock || this.resume()
    return true
}

function resume () {
    this.pause()
    this._buffer.length ? _push.call(this) : _empty.call(this)
}

function pause () {
    _clearTimeoutID.call(this)
    this.lock = true
}

function empty () {
    this._buffer = []
    _clearTimeoutID.call(this)
    _empty.call(this)
}

function _push () {
    var data = (this._buffer || (this._buffer = [])).shift()
    if ('undefined' !== typeof data) this.emit('data', data)

    var me = this
    this.timeoutID = setTimeout(function () {
        _clearTimeoutID.call(me)
        me.lock = false
        me.resume()
    }, this.timeout)
}

function _clearTimeoutID () {
    this.timeoutID && clearTimeout(this.timeoutID)
    this.timeoutID = null
}

function _empty () {
    this.lock = false
    return this.emit('empty')
}

var semaphore = {
    write:  write
  , resume: resume
  , pause:  pause
  , empty:  empty
}

var defaultOption = {
    _buffer: []
  , timeout: 1500
}

module.exports = function createSemaphore (opt) {
    return assign(
            {}
          , events.EventEmitter.prototype
          , semaphore
          , merge(defaultOption, opt || {})
    )
}
