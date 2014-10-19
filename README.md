# react-clickdrag-mixin

Click and drag mixin for React Component.

To make it work, your component have to implement these functions:
- _onDragStart(event, position)
- _onDragStop(event)
- _onDragMove(event, deltaPosition)

### Example

```js
/**
 * @jsx React.DOM
 */
"use strict";

var ClickDrag = require('react-clickdrag-mixin');

var MyComponent = React.createClass({

    mixins: [ClickDrag],

    _onDragStart: function(e, pos) {
        // Fired when the element is clicked (left button mousedown)
    },
    _onDragStop: function(e) {
        // Fired when you release the left mouse button
    },
    _onDragMove: function(e, deltaPos) {
        // Fired on drag move with the delta position between the drag start and the current position
    },

    ...
});

```