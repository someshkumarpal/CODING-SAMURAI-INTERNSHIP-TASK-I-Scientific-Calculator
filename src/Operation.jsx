import { ACTIONS } from "./App"

export default function Operation({ dispatch, operation, cl }) {
  return (
    <div className={`cal-btn ${cl}`}
    onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}
    >
      
      <i className={` ${operation}`}></i>
    </div>
  )
}