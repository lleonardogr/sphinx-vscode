# Estacionamento

Um estacionamento cobra pelo tempo que o carro fica:

- até `30` minutos: **grátis**
- se passar disso: `5.00` por **hora começada** da estadia inteira, então 61 minutos são 2 horas
- o valor nunca passa de `40.00`

**Entrada**

O número de minutos estacionado (1 a 1440).

**Saída**

`Fee: free`, ou o valor com duas casas decimais, como `Fee: 15.00`.

**O que você precisa saber**

- Para arredondar uma divisão para cima: `(minutes + 59) / 60`.
- `Math.min(a, b)` devolve o menor valor.
- `"Fee: %.2f".formatted(fee)` imprime duas casas decimais.
