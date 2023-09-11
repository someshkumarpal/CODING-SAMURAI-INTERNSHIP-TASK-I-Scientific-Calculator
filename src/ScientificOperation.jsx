import { ACTIONS } from "./App"

export default function ScientificOperation({ dispatch, operation, cl }) {
  return (
    <div className={`${cl}`}
    onClick={() => dispatch({ type: ACTIONS.CHOOSE_SCIENTIFIC_OPERATION, payload: { operation } })}
    >
      
      {operation}
    </div>
  )
}