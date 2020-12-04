import React, { Component } from "react";
import "./styles.css";

function draggableElem({
  node = null,
  initialX = 0,
  initialY = 0,
  offsetX = 0,
  offsetY = 0,
  currentX = 0,
  currentY = 0,
  active = false
} = {}) {
  this.node = node;
  this.initialX = initialX;
  this.initialY = initialY;
  this.offsetX = offsetX;
  this.offsetY = offsetY;
  this.currentX = currentX;
  this.currentY = currentY;
  this.active = active;
}

export default class App extends Component {
  state = {
    elements: null
  };

  childrenRefs = {};

  populateState = () => {
    this.childrenNumber = React.Children.count(this.props.children);

    const elements = {};
    for (let i = 0; i < this.childrenNumber; i++) {
      this.childrenRefs[`_ref${i}`] = React.createRef();
      elements[[`_ref${i}`]] = new draggableElem({
        node: this.childrenRefs[`_ref${i}`]
      });
    }
    this.setState({ elements: elements });
  };

  handleDrag = (key) => {
    //const element = this.state.elements[key];
    const node = this.state.elements[key].node.current;
    const dragStart = (e) => {
      if (e.type === "touchstart") {
        this.setState((prevState) => {
          return {
            elements: {
              ...prevState.elements,
              [key]: new draggableElem({
                ...prevState.elements[key],
                initialX:
                  e.touches[0].clientX - prevState.elements[key].offsetX,
                initialY: e.touches[0].clientY - prevState.elements[key].offsetY
              })
            }
          };
        });
      } else {
        this.setState((prevState) => {
          console.log("dragStart", prevState);
          return {
            elements: {
              ...prevState.elements,
              [key]: new draggableElem({
                ...prevState.elements[key],
                initialX: e.clientX - prevState.elements[key]?.offsetX,
                initialY: e.clientY - prevState.elements[key]?.offsetY
              })
            }
          };
        });
      }
      if (e.target === node) {
        this.setState((prevState) => {
          return {
            elements: {
              ...prevState.elements,
              [key]: new draggableElem({
                ...prevState.elements[key],
                active: true
              })
            }
          };
        });
      }
    };

    const dragEnd = (e) => {
      console.log("dragEnd");
      this.setState((prevState) => {
        return {
          elements: new draggableElem({
            ...prevState.elements,
            [key]: {
              ...prevState.elements[key],
              initialX: prevState.elements[key]?.currentX,
              initialY: prevState.elements[key]?.currentY,
              active: false
            }
          })
        };
      });
    };

    const drag = (e) => {
      if (this.state.elements[key]?.active) {
        e.preventDefault();
        if (e.type === "touchmove") {
          this.setState((prevState) => {
            return {
              elements: {
                ...prevState.elements,
                [key]: new draggableElem({
                  ...prevState.elements[key],
                  currentX:
                    e.touches[0].clientX - prevState.elements[key]?.initialX,
                  currentY:
                    e.touches[0].clientY - prevState.elements[key]?.initialY
                })
              }
            };
          });
        } else {
          this.setState((prevState) => {
            return {
              elements: {
                ...prevState.elements,
                [key]: new draggableElem({
                  ...prevState.elements[key],
                  currentX: e.clientX - prevState.elements[key]?.initialX + 1,
                  currentY: e.clientY - prevState.elements[key]?.initialY + 1
                })
              }
            };
          });
        }

        this.setState((prevState) => {
          return {
            elements: {
              ...prevState.elements,
              [key]: new draggableElem({
                ...prevState.elements[key],
                offsetX: prevState.elements[key]?.currentX,
                offsetY: prevState.elements[key]?.currentY
              })
            }
          };
        });

        setTranslate(
          this.state.elements[key]?.currentX,
          this.state.elements[key]?.currentY,
          this.state.elements[key]?.node.current
        );
      }
    };

    const setTranslate = (xPos, yPos, el) => {
      console.log("setTranslate", el, xPos, yPos);
      el.style.left = xPos + "px";
      el.style.top = yPos + "px";
    };
    console.log(this.state.elements[key].node.current);

    this.state.elements[key].node.current.addEventListener(
      "touchstart",
      dragStart,
      false
    );
    this.state.elements[key].node.current.addEventListener(
      "touchend",
      dragEnd,
      false
    );
    this.state.elements[key].node.current.addEventListener(
      "touchmove",
      drag,
      false
    );
    this.state.elements[key].node.current.addEventListener(
      "mousedown",
      dragStart,
      false
    );
    this.state.elements[key].node.current.addEventListener(
      "mouseup",
      dragEnd,
      false
    );
    this.state.elements[key].node.current.addEventListener(
      "mousemove",
      drag,
      false
    );

    return () => {
      node.removeEventListener("touchstart", dragStart, false);
      node.removeEventListener("touchend", dragEnd, false);
      node.removeEventListener("touchmove", drag, false);
      node.removeEventListener("mousedown", dragStart, false);
      node.removeEventListener("mouseup", dragEnd, false);
      node.removeEventListener("mousemove", drag, false);
    };
  };

  handleSurfaceClick = (e) => {
    if (this.state.elements !== null) {
      for (const el in this.state.elements) {
        if (e.target === this.state.elements[el]?.node?.current)
          this.handleDrag(el);
      }
    }
  };
  componentDidMount() {
    this.populateState();
    const surface = document.getElementById("surface");
    surface.addEventListener("click", this.handleSurfaceClick);
  }

  render() {
    if (this.state.elements !== null) {
      //console.log(this.state);
      // this.state.elements && this.state.elements.entries();
      //
    }

    return (
      <div className="App w-full flex flex-col justify-center items-center">
        <h1>Draggable Component</h1>

        <div className="max-w-3xl w-full flex justify-center h-full">
          <div className="w-full flex h-full justify-center">
            <div className="relative w-full" id="surface">
              <ChildrenWithRef refs={this.childrenRefs}>
                {this.props.children}
              </ChildrenWithRef>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const ChildrenWithRef = ({ children, refs }) => {
  return (
    <React.Fragment>
      {React.Children.map(children || null, (child, i) => {
        if (React.isValidElement(child)) {
          return <child.type ref={refs[`_ref${i}`]} {...child.props} key={i} />;
        } else {
          return <span />;
        }
      })}
    </React.Fragment>
  );
};
