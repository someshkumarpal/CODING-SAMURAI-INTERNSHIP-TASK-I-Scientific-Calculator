import { ACTIONS } from "./App"

export default function ScientificOperation({ dispatch, operation, cl }) {
  if(operation ==="fa-sharp fa-solid fa-percent")
  return (  <div className={`cal-btn ${cl}`}
  onClick={() => dispatch({ type: ACTIONS.CHOOSE_SCIENTIFIC_OPERATION, payload: { operation } })}
  >
    
    <i className={` ${operation}`}></i>
  </div>
)
  else return (
    <div className={`${cl}`}
    onClick={() => dispatch({ type: ACTIONS.CHOOSE_SCIENTIFIC_OPERATION, payload: { operation } })}
    >
      
      {operation}
    </div>
  )
}