# Menu da calculadora

Monte uma **calculadora com menu**, aquele tipo de aplicativo de console que continua rodando até o usuário escolher sair. Este teste combina **variáveis**, **condicionais** e **laços** em um programa só.

**O que o seu programa faz**

1. Imprime o menu **uma vez**, no início:

   ```
   === Calculator ===
   1. Add
   2. Subtract
   3. Multiply
   4. Divide
   0. Exit
   ```

2. Depois lê opções, uma por linha, até a opção ser `0`:

| Opção | Lê | Imprime |
|-------|----|---------|
| `1` | uma linha com dois inteiros `a b` | `a + b = resultado` |
| `2` | uma linha com dois inteiros `a b` | `a - b = resultado` |
| `3` | uma linha com dois inteiros `a b` | `a * b = resultado` |
| `4` | uma linha com dois inteiros `a b` | `a / b = resultado` (divisão inteira), ou `Cannot divide by zero` quando `b` é `0` |
| `0` | nada | `Operations: n` (quantas contas imprimiram um resultado), depois `Goodbye!`, e o programa termina |
| qualquer outra | nada | `Invalid option` |

**Exemplo**

Entrada:

```
1
8 2
4
7 0
9
0
```

Saída:

```
=== Calculator ===
1. Add
2. Subtract
3. Multiply
4. Divide
0. Exit
8 + 2 = 10
Cannot divide by zero
Invalid option
Operations: 1
Goodbye!
```

**O que você precisa saber**

- Um laço `while (true)` com `break`, ou um `do … while (option != 0)`, mantém o menu rodando.
- Um `switch` na opção deixa as escolhas fáceis de ler.
- `line.trim().split("\\s+")` separa `"8 2"` em `["8", "2"]`. Transforme cada parte em número com `Integer.parseInt`.
- Conte as operações em uma variável declarada **antes** do laço.
