import { useEffect } from "react";
/**
 * A function component that listens for the "Enter" key press event and executes a callback function when the event occurs.
 * 
 * @param {Object} props - The props object.
 * @param {Function} props.callback - The callback function to be executed when the "Enter" key is pressed.
 */
function EnterKeyListener({ callback }) {
  useEffect(() => {
        const handlePress = (event) => {
      if (event.key === "Enter") {
        callback();
      }
    };

    document.addEventListener("keyup", handlePress);

    return () => {
      document.removeEventListener("keyup", handlePress);
    };
  }, [callback]);
}

export default EnterKeyListener;
