
import { useReducer, useEffect } from 'react';
import './App.scss';
import DigitButton from './DigitButton'
import Operation from './Operation';
import ScientificOperation from './ScientificOperation';

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CHOOSE_SCIENTIFIC_OPERATION: "choose-scientific-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      
      if (payload.digit === "." && (state.currentOperand === null )) {
        if(state.currentOperand=== null){
          return  {
            ...state,
            currentOperand: payload.digit,
            
          }
        }else return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (payload.operation === "fa-sharp fa-solid fa-plus") {
        payload.operation = "+"
      } else if (payload.operation === "fa-sharp fa-solid fa-minus") {
        payload.operation = "-"
      } else if (payload.operation === "fa-sharp fa-solid fa-xmark") {
        payload.operation = "*"
      } else if (payload.operation === "fa-sharp fa-solid fa-divide") {
        payload.operation = "/"
      }else if(payload.operation === "fa-solid fa-angle-up"){
        payload.operation ="^"
      }else if(payload.operation === "fa-sharp fa-solid fa-percent")
        payload.operation="%"
      if (state.scientificOperation != null) {
        state.currentOperand = scientificEvaluate(state);
        state.scientificOperation = null;
        return {
          ...state,
          previousOperand: evaluate(state),
          currentOperand: 0,
          operation: payload.operation,
          scientificOperation: null,
        }

      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }

      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: 0,
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: 0,
      }
    case ACTIONS.CHOOSE_SCIENTIFIC_OPERATION:
      if(payload.operation === "fa-sharp fa-solid fa-percent")
        payload.operation="%"
      if(state.currentOperand == null && state.previousOperand == null && state.operation == null)
      return {
        ...state,
        scientificOperation: payload.operation,
      }
      if (state.operation == null) {
        return {
          ...state,
          overwrite: true,
          scientificOperation: payload.operation,
          operation:"*",
          previousOperand: state.currentOperand,
          currentOperand: 0,
        }
      }
      if (state.operation != null) {
        if(state.currentOperand != null && state.previousOperand!=null)
        return{
          ...state,
          overwrite: true,
          previousOperand: evaluate(state),
          operation: "*",
          currentOperand: 0,
          scientificOperation: payload.operation,
        }
        return {
          ...state,
          scientificOperation: payload.operation,
        }
      }
      return {

      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: 0,
        };
      }
      
      if (
        (state.currentOperand === 0 || state.currentOperand == null) &&
        state.previousOperand == null
      ) {
        return {
          ...state,
          currentOperand: 0,
        };
      }
      
      if (typeof state.currentOperand === 'string' && state.currentOperand.length === 1) {
        return { ...state, currentOperand: 0 };
      }
      
      if (typeof state.currentOperand === 'string' && state.currentOperand !== '0') {
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
        };
      } else if (state.scientificOperation != null) {
        console.log(1);
        return {
          ...state,
          scientificOperation: null,
        };
      } else if (state.operation != null) {
        return {
          ...state,
          operation: null,
        };
      } else if (typeof state.previousOperand === 'string') {
        return {
          ...state,
          previousOperand: state.previousOperand.slice(0, -1),
        };
      } else {
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
        };
      }
      
    case ACTIONS.EVALUATE:
      if (state.scientificOperation != null) {
        state.currentOperand = scientificEvaluate(state);
        state.scientificOperation = null;
        // if(state.operation !== null)
        return {
          ...state,
          previousOperand: evaluate(state),
          currentOperand: 0,
          operation: null,
          scientificOperation: null,
        }
      }
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }
      
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
    default: return { state }
  }

}
function scientificEvaluate({ currentOperand, previousOperand, operation, scientificOperation }) {
  const current = parseFloat(currentOperand)
  if (isNaN(current)) return ""
  let computation = ""
  switch (scientificOperation) {
    case "√":
      computation = Math.sqrt(current)
      break
    case "sin":
      computation = Math.sin(current);
      break
    case "cos":
      computation = Math.cos(current);
      break
    case "tan":
      computation = Math.tan(current);
      break
    case "ln":
      computation = Math.log(current);
      break
    case "log":
      computation = Math.log10(current);
      break
    case "π":
      computation = Math.PI * current;
      break
    case "e":
      computation = Math.E * current;
      break
    case "!":
      function factorial(n) {
        if (n === 0 || n === 1) {
          return 1;
        }

        let result = 1;
        for (let i = 2; i <= n; i++) {
          result *= i;
        }

        return result;
      }
      computation = factorial(current);
      break
    default:
      computation = evaluate({ currentOperand, previousOperand, operation, scientificOperation })
  }

  return computation.toString()
}
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
      case "^":
        computation= Math.pow(prev, current);
        break
      case "%":
        computation = prev * 0.01 * current;
        break
    default:
      computation = current
  }

  return computation.toString()
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (typeof operand !== 'string' || operand === null) {
    return ''; // or some default value that you want to return
  }

  const [integer, decimal] = operand.split(".");
  
  if (decimal === undefined) {
    return INTEGER_FORMATTER.format(integer);
  }
  
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {

  const [{ currentOperand, previousOperand, operation, scientificOperation }, dispatch] = useReducer(
    reducer,
    {}
  )
  const handleKeyPress = (e) => {
    const {key}=e;
    
    const digit  = key;
    const operation = key;
    if (/[0-9.]/.test(digit)) {
      // If the key is a number, dispatch NUMBER action
      
      dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })
    } else if (/[+\-*/]/.test(digit)) {
      // If the key is an operation, dispatch OPERATION action
      dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: {operation} });
    } else if (digit === 'Enter') {
      // If the key is Enter, dispatch EVALUATE action
      dispatch({ type: ACTIONS.EVALUATE })
    }
    // Handle other cases as needed
  };
  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);
  return (
    <div className="flex background">
      <div className='left'>
        
        <div className='center'> <h1 className='center-text'>Scientific Calculator</h1>
        <span>by Somesh Kumar Pal (versin 2.0) </span></div>
      </div>
      <div className='right'>
        <div className='flex-direction-column calculator'>
          <div className="flex-direction-column input-box">
            <div className="ContentChat solution"></div>
            <div className='flex-column previous-operant'><span>{formatOperand(previousOperand)} {operation} {scientificOperation}</span></div>
            <div className='current-operant'>{formatOperand(currentOperand)}</div>
            
          </div>
          <div className="flex-wrap-space-evenly inputs top-sci">
            {/* <div className="cal-btn operator sci chat">Exp</div> */}
            <ScientificOperation operation="sin" cl="sci" dispatch={dispatch} />
            <ScientificOperation operation="cos" cl="sci" dispatch={dispatch} />
            <ScientificOperation operation="tan" cl="sci" dispatch={dispatch} />
            <ScientificOperation operation="log" cl="sci" dispatch={dispatch} />
            <ScientificOperation operation="ln" cl="sci" dispatch={dispatch} />
          </div>
          <div className="flex cal-btns">
            <div className="flex-wrap-space-evenly inputs">
              <div className={`cal-btn clear`} onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
                <i className="fa-sharp fa-solid fa-trash"></i>
              </div>
              <div className={`cal-btn back`} onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
                <i className="fa-sharp fa-solid fa-delete-left"></i>
              </div>

              <Operation operation="fa-sharp fa-solid fa-percent" cl=" operator" dispatch={dispatch} />


              <Operation operation="fa-sharp fa-solid fa-divide" cl="operator" dispatch={dispatch} />
              <DigitButton digit="7" dispatch={dispatch} />
              <DigitButton digit="8" dispatch={dispatch} />
              <DigitButton digit="9" dispatch={dispatch} />
              <Operation operation="fa-sharp fa-solid fa-xmark" cl="operator" dispatch={dispatch} />

              <DigitButton digit="4" dispatch={dispatch} />
              <DigitButton digit="5" dispatch={dispatch} />
              <DigitButton digit="6" dispatch={dispatch} />
              <Operation operation="fa-sharp fa-solid fa-minus" cl="operator" dispatch={dispatch} />

              <DigitButton digit="1" dispatch={dispatch} />
              <DigitButton digit="2" dispatch={dispatch} />
              <DigitButton digit="3" dispatch={dispatch} />
              <Operation operation="fa-sharp fa-solid fa-plus" cl="operator" dispatch={dispatch} />

              <DigitButton digit="0" dispatch={dispatch} />
              <DigitButton digit="." dispatch={dispatch} />

              <div className="cal-btn equal" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}><i className=" fa-sharp fa-solid fa-equals"></i></div>
            </div>
            <div className="flex-wrap-space-evenly sci-btns">
              
              <Operation operation="fa-solid fa-angle-up" cl="sci" dispatch={dispatch} />
              <ScientificOperation operation="!" cl="sci" dispatch={dispatch} />
              <ScientificOperation operation="π" cl="sci" dispatch={dispatch} />
              <ScientificOperation operation="e" cl="sci" dispatch={dispatch} />
              <ScientificOperation operation="√" cl="sci" dispatch={dispatch} />
            </div>
          </div>
        </div>
      </div>
      {/* <div className='right'></div> */}
    </div>
  );
}

export default App;
