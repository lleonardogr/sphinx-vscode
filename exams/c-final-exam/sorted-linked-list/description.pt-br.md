# Lista ligada ordenada

Um placar ou uma fila de eventos mantém os itens em ordem conforme chegam. Uma **lista ligada ordenada** faz isso sem nunca mover os outros: um nó novo é ligado onde deve ficar.

```
add 5
add 1
add 3
print         1 3 5
remove 3
print         1 5
sum           count=2 sum=6
```

**Entrada**

Comandos até o fim da entrada, um por linha:

- `add X`: insere o inteiro `X` (entre −2·10⁹ e 2·10⁹) em ordem crescente; valores iguais vão depois dos que já estão lá;
- `remove X`: remove um `X`;
- `print`: mostra a lista;
- `sum`: mostra quantos valores há e a soma deles.

**Saída**

- `print`: os valores em ordem crescente, separados por espaços, ou `(empty)`;
- `remove X` quando `X` não está na lista: `not found X`;
- `sum`: `count=N sum=S`.

**Coisas para saber**

- Aloque um nó por valor com `malloc` e libere-o quando for removido. Libere o que sobrar no fim.
- Arrays e `qsort` não são permitidos: a lista se mantém em ordem sozinha.
- A soma de dois valores perto de 2·10⁹ não cabe num `int`: use `long long`.
