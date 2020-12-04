// applyRef = () => {
//   this.childrenWithRef = React.Children.map(
//     this.props.children,
//     (child, index) => {
//       if (React.isValidElement(child)) {
//         this[`_ref${index}`] = React.createRef();
//         let childWithRef = React.cloneElement(child, {
//           ref: (this[`_ref${index}`] = child)
//         });
//         return childWithRef;
//       }
//       return child;
//     }
//   );
// };
