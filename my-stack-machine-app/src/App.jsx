import React, { useState } from 'react';
import './App.css'; // Importa o arquivo CSS que você criou

/*
 * Componente: Section
 * Um wrapper reutilizável para padronizar o estilo das seções da página.
 */
const Section = ({ title, children }) => (
  <section className="section-container">
    <h2 className="section-title">{title}</h2>
    {children}
  </section>
);

/*
 * Componente: StackVisualizer
 * Exibe a pilha visualmente, com o "TOP" indicado.
 */
const StackVisualizer = ({ stack }) => (
  <div className="stack-visualizer">
    {stack.length === 0 ? (
      <p className="stack-empty">Pilha vazia</p>
    ) : (
      [...stack].reverse().map((item, index) => (
        <div key={index} className="stack-item">
          {item}
          {index === 0 && <span className="stack-top-label">TOP</span>}
        </div>
      ))
    )}
  </div>
);

/*
 * Componente: LogDisplay
 * Mostra um log das operações executadas.
 */
const LogDisplay = ({ log }) => (
  <div className="log-display">
    {log.map((entry, index) => (
      <p key={index} className={entry.startsWith('ERRO') ? 'log-error' : ''}>
        {`> ${entry}`}
      </p>
    ))}
  </div>
);

/*
 * Componente: App
 * O componente principal que renderiza a página inteira.
 */
export default function App() {
  // Estado para a pilha
  const [stack, setStack] = useState([]);
  // Estado para o valor no input
  const [inputValue, setInputValue] = useState('');
  // Estado para o log de operações
  const [log, setLog] = useState(['Simulador pronto.']);

  // Adiciona uma nova entrada ao log (no topo)
  const addLog = (message) => {
    setLog((prevLog) => [message, ...prevLog.slice(0, 100)]); // Mantém os últimos 100 logs
  };

  // Manipulador para a operação PUSH
  const handlePush = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      setStack((prevStack) => [...prevStack, value]);
      addLog(`PUSH ${value}`);
      setInputValue('');
    } else {
      addLog(`ERRO: Valor inválido para PUSH: "${inputValue}"`);
    }
  };

  // Manipulador para a operação POP
  const handlePop = () => {
    if (stack.length < 1) {
      addLog('ERRO: Pilha vazia, não é possível fazer POP');
      return;
    }
    const newStack = [...stack];
    const value = newStack.pop();
    setStack(newStack);
    addLog(`POP ${value}`);
  };

  // Manipulador genérico para operações aritméticas (ADD, SUB, MUL, DIV)
  const handleOperation = (op) => {
    if (stack.length < 2) {
      addLog(`ERRO: Pilha precisa de 2 operandos para ${op}`);
      return;
    }

    const newStack = [...stack];
    const b = newStack.pop();
    const a = newStack.pop();
    let result;
    let opSymbol = '';

    switch (op) {
      case 'ADD':
        result = a + b;
        opSymbol = '+';
        break;
      case 'SUB':
        result = a - b;
        opSymbol = '-';
        break;
      case 'MUL':
        result = a * b;
        opSymbol = '*';
        break;
      case 'DIV':
        if (b === 0) {
          addLog('ERRO: Divisão por zero');
          // Retorna os operandos para a pilha, pois a operação falhou
          setStack([...newStack, a, b]);
          return;
        }
        result = a / b;
        opSymbol = '/';
        break;
      default:
        return;
    }

    newStack.push(result);
    setStack(newStack);
    addLog(`${op}: ${a} ${opSymbol} ${b} = ${result}. Resultado ${result} na pilha.`);
  };

  // Limpa o simulador
  const handleClear = () => {
    setStack([]);
    setLog(['Simulador limpo e pronto.']);
    setInputValue('');
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        
        {/* --- Cabeçalho --- */}
        <header className="app-header">
          <h1 className="app-title">Máquina de Pilha Abstrata</h1>
          <p className="app-subtitle">Um modelo fundamental para Compiladores</p>
        </header>

        {/* --- INÍCIO DA ALTERAÇÃO --- */}
        <main className="main-content">

          {/* --- O que é? --- */}
          <Section title="O que é uma Máquina de Pilha Abstrata?">
            <p>
              Uma <strong>Máquina de Pilha Abstrata</strong> (Abstract Stack Machine) é um modelo computacional teórico onde a memória primária é uma estrutura de dados do tipo <strong>pilha</strong> (LIFO - Last-In, First-Out). Em vez de usar registradores para armazenar operandos, como nas arquiteturas de CPU mais comuns (ex: x86, ARM), todas as operações (aritméticas, lógicas, etc.) são realizadas implicitamente sobre os valores no topo da pilha.
            </p>
            <p>
              No contexto de <strong>Linguagens Formais e Compiladores</strong>, elas são extremamente importantes. Muitos compiladores não traduzem o código-fonte (como Java, C# ou Python) diretamente para o código de máquina nativo do processador. Em vez disso, eles o traduzem para um código intermediário, e esse código intermediário é frequentemente projetado para ser executado em uma máquina de pilha abstrata.
            </p>
            <p>
              O exemplo mais famoso é a <strong>Java Virtual Machine (JVM)</strong>. O compilador Java (`javac`) compila o código-fonte `.java` para `.class` files, que contêm <strong>Java Bytecode</strong>. Esse bytecode é um conjunto de instruções para uma máquina de pilha.
            </p>
          </Section>

          {/* --- Componentes Principais --- */}
          <Section title="Componentes Principais">
            <ul className="list-disc-style">
              <li>
                <strong>A Pilha (The Stack):</strong> O componente central. Armazena dados temporários, operandos para operações e endereços de retorno de funções.
              </li>
              <li>
                <strong>Conjunto de Instruções (Instruction Set):</strong> Um conjunto de operações simples que manipulam a pilha. Exemplos incluem:
                <ul className="list-none-style">
                  <li><code>PUSH &lt;valor&gt;</code>: Coloca um valor no topo da pilha.</li>
                  <li><code>POP</code>: Remove o valor do topo da pilha.</li>
                  <li><code>ADD</code>: Remove os dois valores do topo, soma-os e coloca o resultado de volta na pilha.</li>
                  <li><code>SUB</code>, <code>MUL</code>, <code>DIV</code>: Operações aritméticas similares.</li>
                  <li><code>JUMP &lt;addr&gt;</code>: Desvia o fluxo de execução para outro endereço.</li>
                  <li><code>JZ &lt;addr&gt;</code> (Jump if Zero): Remove o valor do topo; se for zero, desvia o fluxo.</li>
                </ul>
              </li>
              <li>
                <strong>Ponteiro de Instrução (Instruction Pointer - IP):</strong> Um registrador interno que aponta para a próxima instrução a ser executada no "código" (bytecode).
              </li>
            </ul>
          </Section>

          {/* --- Exemplo de Operação (Simulador) --- */}
          <Section title="Exemplo de Operação: Calculadora de Pilha">
            <p>
              Abaixo está um simulador simples de uma máquina de pilha. Ele permite executar operações básicas para entender o fluxo.
            </p>
            <p>
              Por exemplo, para calcular a expressão <strong>(5 + 3) * 2</strong>, você faria:
            </p>
            <ol className="list-decimal-style">
              <li>Digite <code>5</code> e clique em <strong>PUSH</strong>.</li>
              <li>Digite <code>3</code> e clique em <strong>PUSH</strong>. (Pilha agora é: `[5, 3]`)</li>
              <li>Clique em <strong>ADD</strong>. (Máquina faz POP 3, POP 5, calcula 5+3=8, PUSH 8. Pilha: `[8]`)</li>
              <li>Digite <code>2</code> e clique em <strong>PUSH</strong>. (Pilha agora é: `[8, 2]`)</li>
              <li>Clique em <strong>MUL</strong>. (Máquina faz POP 2, POP 8, calcula 8*2=16, PUSH 16. Pilha: `[16]`)</li>
            </ol>
            <p>
              O resultado final (<code>16</code>) é o valor que resta no topo da pilha.
            </p>

            {/* --- Interface do Simulador --- */}
            <div className="simulator-grid">
              
              {/* --- Lado Esquerdo: Controles --- */}
              <div>
                <h3 className="simulator-subtitle">Controles</h3>
                <div className="controls-container">
                  <div className="push-controls">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Digite um número"
                      className="number-input"
                    />
                    <button
                      onClick={handlePush}
                      className="btn btn-push"
                    >
                      PUSH
                    </button>
                  </div>
                  
                  <div className="op-grid">
                    <button
                      onClick={() => handleOperation('ADD')}
                      disabled={stack.length < 2}
                      className="btn btn-op"
                    >
                      ADD (+)
                    </button>
                    <button
                      onClick={() => handleOperation('SUB')}
                      disabled={stack.length < 2}
                      className="btn btn-op"
                    >
                      SUB (-)
                    </button>
                    <button
                      onClick={() => handleOperation('MUL')}
                      disabled={stack.length < 2}
                      className="btn btn-op"
                    >
                      MUL (*)
                    </button>
                    <button
                      onClick={() => handleOperation('DIV')}
                      disabled={stack.length < 2}
                      className="btn btn-op"
                    >
                      DIV (/)
                    </button>
                  </div>

                  <div className="op-grid">
                    <button
                      onClick={handlePop}
                      disabled={stack.length < 1}
                      className="btn btn-util"
                    >
                      POP
                    </button>
                    <button
                      onClick={handleClear}
                      className="btn btn-clear"
                    >
                      CLEAR
                    </button>
                  </div>
                </div>
                <LogDisplay log={log} />
              </div>

              {/* --- Lado Direito: Visualização da Pilha --- */}
              <div>
                <h3 className="simulator-subtitle">Visualização da Pilha (LIFO)</h3>
                <StackVisualizer stack={stack} />
              </div>
            </div>
          </Section>
          
          {/* --- Referências --- */}
          <Section title="Referências">
            <ul className="list-disc-style">
              <li>
                Aho, A. V., Lam, M. S., Sethi, R., & Ullman, J. D. (2007). 
                <em> Compilers: Principles, Techniques, & Tools</em> (2ª ed.). Addison-Wesley. 
              </li>
              <li>
                Lindholm, T., Yellin, F., Bracha, G., & Buckley, A. (2015). 
                <em> The Java® Virtual Machine Specification, Java SE 8 Edition</em>. Oracle America, Inc.
              </li>
              <li>
                Tanenbaum, A. S., & Bos, H. (2015). 
                <em> Modern Operating Systems</em> (4ª ed.). Pearson.
              </li>
            </ul>
          </Section>

        </main>
        {/* --- FIM DA ALTERAÇÃO --- */}

        
        {/* --- Rodapé --- */}
        <footer className="app-footer">
          <p>Página autoral elaborada para a disciplina de Linguagens Formais e Compiladores.</p>
        </footer>

      </div>
    </div>
  );
}