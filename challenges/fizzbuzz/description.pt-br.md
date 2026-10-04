# FizzBuzz

O clássico! Imprima os números de 1 até `n`, um por linha, mas:

- para múltiplos de **3**, imprima `Fizz` no lugar do número;
- para múltiplos de **5**, imprima `Buzz`;
- para múltiplos de **3 e de 5 ao mesmo tempo**, imprima `FizzBuzz`.

**Entrada**

Um inteiro `n` (1 ≤ n ≤ 1000).

**Saída**

`n` linhas, como descrito.

**O que você precisa saber**

- `i % 3 == 0` quer dizer "múltiplo de 3".
- Teste o caso **dos dois** primeiro (`i % 3 == 0 && i % 5 == 0`, ou `i % 15 == 0`): uma cadeia de else if para na primeira condição verdadeira.
- Imprima o próprio número só quando nenhum dos três casos se aplica.
