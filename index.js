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

// const dfa = automaton.toDFA();
// dfa.debug();
// console.log(dfa.visualize());
// console.log(dfa.accepts("AB12"));

// const nfa = automaton.toNFA();
// nfa.debug();
// console.log(nfa.visualize());
// console.log(nfa.accepts("AB12"));

// const minNFA = automaton.toMinNFA();
// minNFA.debug();
// console.log(minNFA.visualize());
// console.log(minNFA.accepts("AB12"));

// const minDFA = dfa.toMinDFA();
// minDFA.debug();
// console.log(minDFA.visualize());
// console.log(minDFA.accepts("AB12"));

// explicações do funcionamento do automaton
// temos uma classe "automaton"
// que tem um array de estados, um array de transições, um array de estados de aceitação, um array de símbolos do alfabeto e um estado inicial
// cada estado
// tem um nome, um array de transições e um array de estados para os quais ele pode ir
// o estado inicial é onde começamos a avaliar se uma string é aceita
// e caso no fim da string termine em um estado de aceitação, a string é aceita
// o automaton é gerado a partir da função parseAutomaton, a qual
// lê um arquivo de texto e cria um automaton a partir dele
// o arquivo de texto é composto por linhas que começam com #
// e cada # indica um tipo de informação
// #states indica que as próximas linhas serão os nomes dos estados
// #initial indica que a próxima linha será o nome do estado inicial
// #accepting indica que as próximas linhas serão os nomes dos estados de aceitação
// #alphabet indica que as próximas linhas serão os símbolos do alfabeto
// #transitions indica que as próximas
// linhas serão as transições
// e o metodo accepts dentro da classe automaton valida se uma string é aceita ou não, funcionando da seguinte forma:
// ele começa com o estado inicial
// e para cada símbolo da string
// ele verifica se o estado atual tem uma transição para um estado que aceita aquele símbolo
// caso tenha, ele vai para o estado que aceita aquele símbolo
// caso não tenha, a string não é aceita
// e ele retorna false
// caso ele chegue ao fim da string e o estado atual seja um estado de aceitação, a string é aceita
// e ele retorna true
// caso ele chegue ao fim da string e o estado atual não seja um estado de aceitação, a string não é aceita
// e ele retorna false
// por fim temos os metodos de conversão dos tipos de automatos
// o metodo toDFA converte um automaton para um dfa, funcionando da seguinte forma:
// ele cria um novo dfa
// e para cada estado do automaton
// ele cria um novo estado no dfa
// e para cada símbolo do alfabeto
// ele verifica se o estado atual do
// automaton tem uma transição para um estado que aceita aquele símbolo
// caso tenha, ele cria uma transição do estado atual do dfa para o estado que aceita aquele símbolo
// caso não
// ele cria uma transição do estado atual do dfa para um estado de erro
// e por fim ele retorna o dfa
// o metodo toNFA converte um automaton para um nfa, funcionando da seguinte forma:
// ele cria um novo nfa
// e para cada estado do automaton
// ele cria um novo estado no nfa
// e para cada símbolo do alfabeto
// ele verifica se o estado atual do
// automaton tem uma transição para um estado que aceita aquele símbolo
// caso tenha, ele cria uma transição do estado atual do nfa para o estado que aceita aquele símbolo
// caso não
// ele cria uma transição do estado atual do nfa para um estado de erro
// e por fim ele retorna o nfa
// o metodo toMinNFA converte um automaton para um nfa mínimo, funcionando da seguinte forma:
// ele cria um novo nfa mínimo
// e para cada estado do automaton
// ele cria um novo estado no nfa mínimo
// e para cada símbolo do alfabeto
// ele verifica se o estado atual do
// automaton tem uma transição para um estado que aceita aquele símbolo
// caso tenha, ele cria uma transição do estado atual do nfa mínimo para o estado que aceita aquele símbolo
// caso não
// ele cria uma transição do estado atual do nfa mínimo para um estado de erro
// e por fim ele retorna o nfa mínimo
// o metodo toMinDFA converte um dfa para um dfa mínimo, funcionando da seguinte forma:
// ele cria um novo dfa mínimo
// e para cada estado do dfa
// ele cria um novo estado no dfa mínimo
// e para cada símbolo do alfabeto
// ele verifica se o estado atual do
// dfa tem uma transição para um estado que aceita aquele símbolo
// caso tenha, ele cria uma transição do estado atual do dfa mínimo para o estado que aceita aquele símbolo
// caso não
// ele cria uma transição do estado atual do dfa mínimo para um estado de erro
// e por fim ele retorna o dfa mínimo
// o metodo debug imprime no console todas as informações do automaton
// o metodo visualize retorna uma string com todas as informações do automaton
// e o metodo visualizeGraph retorna uma string com todas as informações do automaton no formato de um grafo
// o qual ainda não funciona corretamente
// e por fim temos o metodo main, que lê o arquivo de texto e cria o automaton
// e depois chama o metodo visualize para imprimir no console todas as informações do automaton
// e chama o metodo accepts para validar se uma string é aceita ou não
// e por fim chama o metodo visualizeGraph para imprimir no console todas as informações do automaton no formato de um grafo
// e o qual ainda não funciona corretamente
// obs: os metodos de conversão ainda estão com problemas ocasionais =/
