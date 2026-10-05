# Moedas (enum)

Um **enum** é um tipo com um conjunto fixo de valores. Dê ao enum `Coin` um valor em centavos para cada moeda e depois conte um monte de moedas:

| Moeda | Centavos |
|-------|---------:|
| `PENNY` | 1 |
| `NICKEL` | 5 |
| `DIME` | 10 |
| `QUARTER` | 25 |

Para `quarter dime dime penny`:

```
PENNY x1
DIME x2
QUARTER x1
Total: 46 cents
```

**Entrada**

Uma linha com nomes de moedas separados por espaços, misturando maiúsculas e minúsculas.

**Saída**

- `Unknown coin: nome` para cada nome que não é moeda, na ordem da entrada, como foi escrito
- depois uma linha `COIN xN` para cada moeda que apareceu, na ordem do enum (`PENNY` até `QUARTER`)
- depois `Total: N cents`

**O que você precisa saber**

- Constantes de enum podem ter **campos**: escreva `PENNY(1)` e um construtor `Coin(int cents)` dentro do enum.
- `Coin.values()` devolve todas as constantes na ordem, e `name()` devolve o nome de uma constante.
- Um `EnumMap<Coin, Integer>` é um mapa cujas chaves são constantes do enum, mantidas na ordem do enum.
