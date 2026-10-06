# Soma de pares: lento e rápido

Leia uma lista de números e um alvo, e ache dois números (em posições diferentes) cuja soma é o alvo. Faça de dois jeitos e compare quantas somas cada um verifica.

- A **força bruta** verifica cada par em ordem: (1º, 2º), (1º, 3º), …, (2º, 3º), … e para no primeiro par que funciona. Ela pode verificar cerca de n²/2 pares: cresce como **n²**.
- Os **dois ponteiros** trabalham numa **cópia ordenada**. Começam pelo menor e pelo maior número. Se a soma deles for pequena demais, passam para o próximo número maior do lado esquerdo; se for grande demais, para o próximo menor do lado direito. Verificam no máximo n − 1 somas: crescem como **n** (mais a ordenação, cerca de n log n).

**Entrada**

Três linhas: a quantidade `n` (2 ≤ n ≤ 100), os `n` números e o alvo.

**Saída**

Três linhas:

- `Pair: A + B`, com o primeiro par que a força bruta acha (A vem antes na lista), ou `Pair: none`.
- `Brute force: ` e o número de somas que ela verificou.
- `Two pointers: ` e o número de somas que eles verificaram (a ordenação não conta).

**O que você precisa saber**

- Para a força bruta use a ordem original; para os dois ponteiros ordene uma cópia: `int[] sorted = Arrays.copyOf(numbers, n); Arrays.sort(sorted);`
- Os dois ponteiros param quando a soma bate ou quando os ponteiros se encontram (`lo >= hi`).
- Os dois acham um par sempre que ele existe, mas numa lista longa a diferença de trabalho é enorme.
