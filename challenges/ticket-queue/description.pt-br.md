# Fila de atendimento (ArrayDeque)

Simule a fila de um balcão de atendimento. As pessoas são atendidas na ordem em que chegam: **o primeiro a entrar é o primeiro a sair**.

| Comando | Imprime |
|---------|---------|
| `arrive NAME` | `NAME joined at position p` (`p` conta a partir de 1 na frente) |
| `serve` | `Serving NAME` para quem está na frente, que sai da fila, ou `No one waiting` |
| `status` | `Waiting: Ana, Bia` da frente para o fim, ou `Waiting: nobody` |

**Entrada**

- Linha 1: `n`, o número de comandos
- Depois, `n` comandos. Nomes não têm espaços.

**Saída**

Uma linha por comando.

**O que você precisa saber**

- Uma **fila** coloca no fim e tira da frente. O `ArrayDeque` faz as duas coisas rápido: `offer(x)` coloca, `poll()` tira e devolve quem está na frente (ou `null` se estiver vazia).
- Tirar o primeiro elemento de um `ArrayList` empurra todos os outros, o que fica lento. Filas existem para isso.
- `queue.size()` dá a posição de quem acabou de entrar.
