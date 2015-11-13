# react-clickdrag

[![NPM](https://nodei.co/npm/react-clickdrag.png)](https://nodei.co/npm/react-clickdrag/)

With `react-clickdrag`, you'll be able to easily add a click and drag feature on every component you want.

## Usage

`react-clickdrag` is a special function which takes 2 arguments. The first one is the Component itself, the second argument is the options `react-clickdrag` can take.

The options are:
- `touch`: Enable touch events (default: false)
- `resetOnSpecialKeys`: Decide to reset the mouse position when a special keys is pressed (ctrl, shift, alt). (default: false)
- `getSpecificEventData`: Function to specify if you need specific data from the mouse/touch event. (default: empty function)
- `onDragStart`: Function called when you start dragging the component. (default: empty function)
- `onDragStop`: Function called when you stop dragging the component. (default: empty function)
- `onDragMove`: Function called when you move the component. (default: empty function)

When you wrap your component using the `clickdrag` function, your component will receive a special props called `dataDrag`. Inside this `dataDrag` object, you'll find these information:
- `isMouseDown` (boolean)
- `isMoving` (boolean)
- `mouseDownPositionX` (number)
- `mouseDownPositionY` (number)
- `moveDeltaX` (number)
- `moveDeltaY` (number)

If you defined a specific event data function using `getSpecificEventData`. You'll also find the information you specify in the `dataDrag` props.

## Example

Here's a copy of the example you can find in [example folder](/examples/basic/)

```js
import clickdrag from 'react-clickdrag';


class ExampleComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lastPositionX: 0,
            lastPositionY: 0,
            currentX: 0,
            currentY: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.dataDrag.isMoving) {
            this.setState({
                currentX: this.state.lastPositionX + nextProps.dataDrag.moveDeltaX,
                currentY: this.state.lastPositionY + nextProps.dataDrag.moveDeltaY
            });
        }
        else {
            this.setState({
                lastPositionX: this.state.currentX,
                lastPositionY: this.state.currentY
            });
        }
    }

    render() {
        var translation = 'translate('+this.state.currentX+'px, '+this.state.currentY+'px)';

        return React.createElement('div', {
            style: {width: '200px', height: '200px', backgroundColor: 'red', transform: translation}
        });
    }
}

var ClickDragExample = clickDrag(ExampleComponent, {touch: true});

export default ClickDragExample;

```
You can find another example of this module inside [react-number-editor](https://github.com/tleunen/react-number-editor).

## License

MIT, see [LICENSE.md](/LICENSE.md) for details.
