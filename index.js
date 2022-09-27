// EXEMPLO
// #states
// s0
// s1
// s2
// s3
// #initial
// s0
// #accepting
// s0
// s1
// s2
// s3
// #alphabet
// a
// b
// c
// #transitions
// s0:b>s3
// s0:c>s1,s2
// s1:a>s2,s3
// s1:c>s1,s2
// s2:c>s3
// s3:a>s1
// s3:c>s1

const fs = require('fs');

class State {
  constructor(name) {
    this.name = name;
    this.transitions = [];
  }
}

class Transition {
  constructor(from, to, symbol) {
    this.from = from;
    this.to = to;
    this.symbol = symbol;
  }
}

class Automaton {
  constructor() {
    this.states = [];
    this.initial = null;
    this.accepting = [];
    this.alphabet = [];
    this.transitions = [];
  }

  debug() {
    console.log('states', this.states);
    console.log('initial', this.initial);
    console.log('accepting', this.accepting);
    console.log('alphabet', this.alphabet);
    console.log('transitions', this.transitions);
  }

  visualize() {
    let output = "";
    for (let state of this.states) {
      output += state.name + ":";
      for (let transition of state.transitions) {
        output += transition.symbol + ">" + transition.to.name + ",";
      }
      output = output.slice(0, -1);
      output += "\n";
    }
    return output;
  }

  accepts(string) {
    let current = this.initial;
    for (const element of string) {
      let found = false;
      for (let transition of current.transitions) {
        if (transition.symbol == element) {
          current = transition.to;
          found = true;
          break;
        }
      }
      if (!found) {
        return false;
      }
    }
    return this.accepting.includes(current);
  }

  toDFA() {
    let dfa = new Automaton();
    let queue = [];
    let visited = new Map();
    let initial = this.initial.name;
    queue.push(initial);
    visited.set(initial, true);
    while (queue.length > 0) {
      let state = queue.shift();
      let stateName = state;
      let stateObject = new State(stateName);
      dfa.states.push(stateObject);
      if (stateName == initial) {
        dfa.initial = stateObject;
      }
      if (this.accepting.includes(state)) {
        dfa.accepting.push(stateObject);
      }
      for (let symbol of this.alphabet) {
        let newState = "";
        for (let i = 0; i < state.length; i++) {
          let transitions = this.states[i].transitions;
          for (let transition of transitions) {
            if (transition.symbol == symbol) {
              newState += transition.to.name;
            }
          }
        }
        if (newState == "") {
          newState = "$";
        }
        if (!visited.has(newState)) {
          queue.push(newState);
          visited.set(newState, true);
        }
        let transition = new Transition(stateObject, dfa.states.find(s => s.name == newState), symbol);
        stateObject.transitions.push(transition);
        dfa.transitions.push(transition);
      }
    }
    dfa.alphabet = this.alphabet;
    return dfa;
  }

  toMinDFA() {
    let dfa = this.toDFA();
    let states = dfa.states;
    let accepting = dfa.accepting;
    //// let nonAccepting = states.filter(s => !accepting.includes(s));
    let queue = [];
    let visited = new Map();
    let initial = dfa.initial.name;
    queue.push(initial);
    visited.set(initial, true);
    while (queue.length > 0) {
      let state = queue.shift();
      let stateName = state;
      let stateObject = states.find(s => s.name == stateName);
      if (stateName == initial) {
        dfa.initial = stateObject;
      }
      if (accepting.includes(state)) {
        dfa.accepting.push(stateObject);
      }
      for (let symbol of dfa.alphabet) {
        let newState = "";
        for (let i = 0; i < state.length; i++) {
          let transitions = states[i].transitions;
          for (let transition of transitions) {
            if (transition.symbol == symbol) {
              newState += transition.to.name;
            }
          }
        }
        if (newState == "") {
          newState = "$";
        }
        if (!visited.has(newState)) {
          queue.push(newState);
          visited.set(newState, true);
        }
        let transition = new Transition(stateObject, states.find(s => s.name == newState), symbol);
        stateObject.transitions.push(transition);
        dfa.transitions.push(transition);
      }
    }
    dfa.alphabet = this.alphabet;
    return dfa;
  }

  toNFA() {
    let nfa = new Automaton();
    let states = this.states;
    let accepting = this.accepting;
    //// let nonAccepting = states.filter(s => !accepting.includes(s));
    let queue = [];
    let visited = new Map();
    let initial = this.initial.name;
    queue.push(initial);
    visited.set(initial, true);
    while (queue.length > 0) {
      let state = queue.shift();
      let stateName = state;
      let stateObject = new State(stateName);
      nfa.states.push(stateObject);
      if (stateName == initial) {
        nfa.initial = stateObject;
      }
      if (accepting.includes(state)) {
        nfa.accepting.push(stateObject);
      }
      for (let symbol of this.alphabet) {
        let newState = "";
        for (let i = 0; i < state.length; i++) {
          let transitions = states[i].transitions;
          for (let transition of transitions) {
            if (transition.symbol == symbol) {
              newState += transition.to.name;
            }
          }
        }
        if (newState == "") {
          newState = "$";
        }
        if (!visited.has(newState)) {
          queue.push(newState);
          visited.set(newState, true);
        }
        let transition = new Transition(stateObject, nfa.states.find(s => s.name == newState), symbol);
        stateObject.transitions.push(transition);
        nfa.transitions.push(transition);
      }
    }
    nfa.alphabet = this.alphabet;
    return nfa;
  }

  toMinNFA() {
    let nfa = this.toNFA();
    let states = nfa.states;
    let accepting = nfa.accepting;
    //// let nonAccepting = states.filter(s => !accepting.includes(s));
    let queue = [];
    let visited = new Map();
    let initial = nfa.initial.name;
    queue.push(initial);
    visited.set(initial, true);
    while (queue.length > 0) {
      let state = queue.shift();
      let stateName = state;
      let stateObject = states.find(s => s.name == stateName);
      if (stateName == initial) {
        nfa.initial = stateObject;
      }
      if (accepting.includes(state)) {
        nfa.accepting.push(stateObject);
      }
      for (let symbol of nfa.alphabet) {
        let newState = "";
        for (let i = 0; i < state.length; i++) {
          let transitions = states[i].transitions;
          for (let transition of transitions) {
            if (transition.symbol == symbol) {
              newState += transition.to.name;
            }
          }
        }
        if (newState == "") {
          newState = "$";
        }
        if (!visited.has(newState)) {
          queue.push(newState);
          visited.set(newState, true);
        }
        let transition = new Transition(stateObject, states.find(s => s.name == newState), symbol);
        stateObject.transitions.push(transition);
        nfa.transitions.push(transition);
      }
    }
    nfa.alphabet = this.alphabet;
    return nfa;
  }
}

function parseAutomaton(filename) {
  const automaton = new Automaton();
  const lines = fs.readFileSync(filename, 'utf8').split('\n').map((e) => e.replace('\r', ''));
  let state = null;
  for (const line of lines) {
    if (line.startsWith('#')) {
      state = line;
      continue;
    }
    if (line === '') {
      continue;
    }
    switch (state) {
      case '#states':
        automaton.states.push(new State(line));
        break;
      case '#initial':
        automaton.initial = automaton.states.find(s => s.name === line);
        break;
      case '#accepting':
        automaton.accepting.push(automaton.states.find(s => s.name === line));
        break;
      case '#alphabet':
        automaton.alphabet.push(line);
        break;
      case '#transitions':
        const [from, toState] = line.split('>');
        const [fromState, symbol] = from.split(':');
        const transition = new Transition(automaton.states.find(s => s.name === fromState), automaton.states.find(s => s.name === toState), symbol);
        automaton.transitions.push(transition);
        automaton.states.find(s => s.name === fromState).transitions.push(transition);
        break;
    }
  }
  return automaton;
}

const automaton = parseAutomaton('automato.txt');
automaton.debug();
console.log(automaton.visualize());
console.log(automaton.accepts("AB12"));
