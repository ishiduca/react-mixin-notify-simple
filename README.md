# react-mixin-notify-simple

## usage

```js
var React      = require('react')
var NotifMixin = require('react-mixin-notify-simple')
var Store      = require('./path/to/store')

var Notify = React.createClass({
    mixins: [NotifMixin]
  , componentDidMount: function () {
        var me = this
        Store.onChange(function () {
            me.semaphore.write(Store.getValue())
        })
    }
  , render: function () {
        var msg = this.getMessage()
        return (
            <div
                style={this.getStyle()}
                onClick={this.clearMessage}
            >
                {msg && (<span>{msg}</span>)}
            </div>
        )
    }
})


React.render(
    <Notify
        timeout={1200}
      , styles={{
            base: {...}
          , none: {display: 'none'}
          , error: {...}
          , info:  {...}
        }}
    />
  , document.body
)
```

### example

```
npm run example_build
open ./example/index.html
```

