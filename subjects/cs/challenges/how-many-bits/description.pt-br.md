# Quantos bits?

Cada bit é 0 ou 1, então 1 bit tem 2 valores, e cada bit a mais os **dobra**: 8 bits (um byte) guardam **256** valores, de 0 a 255. No sentido contrário, um número precisa de tantos bits quantas vezes dá para **dividi-lo ao meio** até chegar a 0: 300 → 150 → 75 → 37 → 18 → 9 → 4 → 2 → 1 → 0 são 9 divisões, então 300 precisa de **9 bits**, que são **2 bytes**.

Responda às duas perguntas.

**Entrada**

Uma linha, ou `bits n` (1 ≤ n ≤ 62) ou `number x` (0 ≤ x ≤ 10¹⁸).

**Saída**

Para `bits n`: `Values: ` e quantos valores n bits guardam, depois `Largest: ` e o maior deles (contando a partir do 0).

Para `number x`: `Bits: ` e quantos bits x precisa (o 0 precisa de 1), depois `Bytes: ` e quantos bytes inteiros esses bits ocupam.

**O que você precisa saber**

- Use `long`: 62 bits guardam mais de 4 quintilhões de valores.
- `(bits + 7) / 8` divide por 8 e arredonda para cima.
- Dobre e divida ao meio em laços: `Math.pow`, `Math.log`, `<<` e os métodos que contam bits não valem aqui.
