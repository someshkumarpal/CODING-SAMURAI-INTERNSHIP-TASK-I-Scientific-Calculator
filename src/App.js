
import { useReducer } from 'react';
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
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
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
      }
      if (state.scientificOperation != null) {
        state.currentOperand = scientificEvaluate(state);
        state.scientificOperation = null;
        return {
          ...state,
          previousOperand: evaluate(state),
          currentOperand: null,
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
          currentOperand: null,
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    case ACTIONS.CHOOSE_SCIENTIFIC_OPERATION:
      if (state.operation == null) {
        return state;
      }
      if (state.operation != null) {
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
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
    case ACTIONS.EVALUATE:
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
    case "%":
      computation = 0.01 * current;
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
  console.log(previousOperand);
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
    default:
      computation = current
  }

  return computation.toString()
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

  const [{ currentOperand, previousOperand, operation, scientificOperation }, dispatch] = useReducer(
    reducer,
    {}
  )

  return (
    <div className="flex background">
      <div className='left'></div>
      <div className='right'>
        <div className='flex-direction-column calculator'>
          <div className="flex-direction-column input-box">
            <div className="ContentChat solution"></div>
            <div className='flex-column previous-operant'><span>{formatOperand(previousOperand)} {operation} {scientificOperation}</span></div>
            <div className='current-operant'>{formatOperand(currentOperand)}</div>
            {/* <div className="input-field">
          <input id="display" type="text" key="name" required readonly />
          <label for="name">0</label>
        </div> */}
          </div>
          <div className="flex-wrap-space-evenly inputs top-sci">
            <div className="cal-btn operator sci chat">Exp</div>
            <ScientificOperation operation="sin" cl="sci" dispatch={dispatch} />
            <ScientificOperation operation="cos" cl="sci" dispatch={dispatch} />
            <ScientificOperation operation="tan" cl="sci" dispatch={dispatch} />
            <ScientificOperation operation="log" cl="sci" dispatch={dispatch} />

          </div>
          <div className="flex cal-btns">
            <div className="flex-wrap-space-evenly inputs">
              <div className={`cal-btn clear`} onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
                <i className="fa-sharp fa-solid fa-trash"></i>
              </div>
              <div className={`cal-btn back`} onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
                <i className="fa-sharp fa-solid fa-delete-left"></i>
              </div>

              <Operation operation="fa-sharp fa-solid fa-percent" cl="operator" dispatch={dispatch} />


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
              <ScientificOperation operation="ln" cl="sci" dispatch={dispatch} />
              <Operation operation="fa-solid fa-angle-up" cl="sci" dispatch={dispatch} />
              <ScientificOperation operation="!" cl="sci" dispatch={dispatch} />
              <ScientificOperation operation="π" cl="sci" dispatch={dispatch} />
              <ScientificOperation operation="e" cl="sci" dispatch={dispatch} />
              <ScientificOperation operation="√" cl="sci" dispatch={dispatch} />
              <ScientificOperation operation=")" cl="sci" dispatch={dispatch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
