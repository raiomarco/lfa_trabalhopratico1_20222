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
