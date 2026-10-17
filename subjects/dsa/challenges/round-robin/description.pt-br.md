# Escalonador round-robin

Um computador roda muito mais programas do que tem núcleos de processador, então o sistema operacional reveza: cada programa roda por uma **fatia de tempo** curta e, se não terminou, vai para o fim da fila. Isso é **round robin**, e a fila é uma fila de verdade.

Simule isso. Todo processo chega no tempo 0, na ordem da entrada. Repetidamente pegue o processo da frente, rode-o pela fatia de tempo (ou menos, se ele precisar de menos) e mande-o para o fundo se ainda faltar tempo.

Para uma fatia de 3 e os processos `A 5`, `B 2`, `C 4`: A roda de 0 a 3, B roda de 3 a 5 e termina, C roda de 5 a 8, A roda de 8 a 10 e termina, C roda de 10 a 11 e termina. Cada processo esperou seu tempo de fim menos o tempo de que precisava: A 5, B 3 e C 7.

```
B finishes at 5
A finishes at 10
C finishes at 11
average waiting: 5.00
```

**Entrada**

- Linha 1: `n` e a fatia de tempo `q` (1 ≤ n ≤ 1.000; 1 ≤ q ≤ 100)
- Depois `n` linhas com o nome de um processo (letras e dígitos) e o tempo de que ele precisa (1 a 1.000)

**Saída**

Uma linha por processo, na ordem em que terminam: o nome, ` finishes at ` e o tempo. Depois `average waiting: ` e a espera média com duas casas decimais.

**Bom saber**

- `ArrayDeque` é uma fila: `offer(x)` coloca no fundo, `poll()` tira da frente.
- Guarde juntos o nome e o tempo restante de cada processo, num `record` ou num `int[]` com um array paralelo de nomes.
- Tempo de espera = tempo de fim − tempo necessário, já que todos chegam em 0.
