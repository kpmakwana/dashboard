let isLocalStoreAvailable = localStorage.getItem('progressTable') !== null;
let emptyState =
  {
    groupResult:{},
    qualifierResult:{},
    quaterFinalResult:{},
    semiFinalResult:{},
    finalResult:{},
    // status 2 means match is done, 1 means match is being played, 0 means match has not started
    groupStatus:1,
    qualifierStatus:[0,0,0,0,0,0,0,0],
    quaterFinalStatus:[0,0,0,0],
    semiFinalStatus:[0,0],
    finalStatus:[0,0]
};
let localState = JSON.parse(localStorage.getItem('progressTable'));
let intialState = isLocalStoreAvailable ? localState : emptyState;

const reducer = (state = intialState, action) => {
  let newState = {...state};

  switch (action.type) {

    case "RECORD_GROUP_RESULT": {
      newState.groupResult = action.data;
      newState.groupStatus = 2;
      return newState;
    }

    case "RECORD_QUALIFIER_RESULT": {
      newState.qualifierResult[action.index] = action.data;
      newState.qualifierStatus[action.index] = 2;
      if (action.index < 7) {
        newState.qualifierStatus[action.index + 1] = 1;
      }
      return newState;
    }

    case "RECORD_SEMI_FINAL_RESULT": {
      newState.semiFinalResult[action.index] = action.data;
      newState.semiFinalStatus[action.index] = 2;
      if (action.index < 1) {
        newState.semiFinalStatus[action.index + 1] = 1;
      }
      return newState;
    }

    case "RECORD_FINAL_RESULT": {
      newState.finalResult[action.index] = action.data;
      newState.finalStatus[action.index] = 2;
      if (action.index < 1) {
        console.log(action.index);
        newState.finalStatus[action.index + 1] = 1;
      }
      return newState;
    }

    case "RECORD_QUATER_FINAL_RESULT": {
      newState.quaterFinalResult[action.index] = action.data;
      newState.quaterFinalStatus[action.index] = 2;
      if (action.index < 3) {
        newState.quaterFinalStatus[action.index + 1] = 1;
      }
      return newState;
    }

    case "START_QUALIFIER": {
      newState.qualifierStatus[action.index] = 1;
      return newState;
    }
    case "START_QUATERFINAL": {
      newState.quaterFinalStatus[action.index] = 1;
      return newState;
    }
    
    case "START_SEMIFINAL": {
      newState.semiFinalStatus[action.index] = 1;
      return newState;
    }

    case "START_FINAL": {
      console.log(action.index);
      newState.finalStatus[action.index] = 1;
      return newState;
    }

    case "RESET_DATA" : {
      return {...emptyState};
    }

    default:
      return newState;
  }
}

export default reducer;