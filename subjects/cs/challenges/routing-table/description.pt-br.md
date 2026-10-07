# Tabela de roteamento

Um roteador não conhece o caminho inteiro até cada endereço. Ele tem uma **tabela de roteamento**: uma lista de redes e, para cada uma, para onde mandar os pacotes em seguida. As redes muitas vezes se sobrepõem, então o roteador usa a correspondência mais específica, o **maior prefixo**:

| Rede | Próximo salto |
|------|---------------|
| `0.0.0.0/0` | Internet |
| `10.0.0.0/8` | Office |
| `10.1.0.0/16` | Lab |
| `10.1.2.0/24` | Servers |

`10.1.2.3` corresponde às rotas /0, /8, /16 e /24: o maior prefixo vence, então ele vai para **Servers**. `10.1.9.9` vai para **Lab**, `10.200.0.1` para **Office**, e `8.8.8.8` só corresponde a `0.0.0.0/0`, a **rota padrão**, então vai para a **Internet**.

Leia uma tabela de roteamento e decida para onde vai cada endereço.

**Entrada**

O número de rotas `r` (1 ≤ r ≤ 50), depois uma rota por linha: um endereço de rede, `/`, um prefixo de 0 a 32, um espaço e o nome do próximo salto. Depois o número de endereços `n` (1 ≤ n ≤ 50) e um endereço IPv4 por linha.

**Saída**

Para cada endereço, uma linha `endereco -> proximo salto`, ou `endereco -> no route` se nenhuma rota corresponder.

**O que você precisa saber**

- Uma rota `rede/p` corresponde a um endereço quando os primeiros `p` bits dos dois são iguais. Com os dois como números de 32 bits num `long`, compare `endereco >> (32 - p)` com `rede >> (32 - p)`.
- `/0` corresponde a todo endereço e `/32` a um só.
- Transformar um endereço em número é igual ao da calculadora de sub-rede: `valor = valor * 256 + parte`.
