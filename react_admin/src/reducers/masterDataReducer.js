const init = {
    booleanQuestion: [{ id: "", description: "" }, { id: "1", description: "Si" }, { id: "0", description: "No"}],
    playerType: [{ id: "", description: "" }, { id: "NORMAL", description: "NORMAL" }, { id: "RARO", description: "RARO"}],
    duplicateTime: [{ id: "", description: "" }, { id: "1", description: "1" }, { id: "2", description: "2"}],
    rating:[{ id: "", description: "" }, 
            { id: "85", description: "85" }, 
            { id: "84", description: "84" }, 
            { id: "83", description: "83"}, 
            { id: "82", description: "82"}, 
            { id: "81", description: "81"}, 
            { id: "80", description: "80"},
            { id: "79", description: "79"},
            { id: "78", description: "78"},
            { id: "77", description: "77"},
            { id: "76", description: "76"},
            { id: "75", description: "75"}]
  }
  
  
  function masterDataReducer(state = init, { type, payload }) {
    switch (type) {      
      default:
        return state
    }
  }
  
  export default masterDataReducer