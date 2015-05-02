'use strict'
var events   = require('events')
var React    = require('react')
var SemMixin = require('../lib/mixin')
var Store    = new events.EventEmitter
var buffer   = []

Store.getValue = function () {
    return buffer.shift()
}

var Notify = React.createClass({
    mixins: [SemMixin]
  , render: function () {
        var msg = this.getMessage()
        return (
            <section
                style={this.getStyle()}
                onClick={this.clearMessage}
            >
                {
                    msg && (<span>{msg}</span>)
                }
            </section>
        )
    }
  , componentDidMount: function () {
        var me = this
        Store.on('change', function () {
            me.semaphore.write(Store.getValue())
        })
    }
})

React.render(
    <Notify
        timeout={1500}
        styles={{
            base: {
                padding: '12px'
              , cursor: 'pointer'
              , borderRadius: '12px'
              , fontFamily: 'Arial'
              , fontSize: '20px'
            }
          , none: {
                display: 'none'
            }
          , error: {
                backgroundColor: '#ffaa33'
              , fontWeight: 'bold'
            }
          , info: {
                backgroundColor: '#000000'
              , color: '#aaaaaa'
            }
        }}
    />
 , document.body
)

window.onload = function () {
    ('There is more than "hogeError" one way to do it').split(' ').forEach(
    function (str) {
        buffer.push(str)
        Store.emit('change')
    })
}
