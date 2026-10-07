# Endereço IP para número

Os pontos num endereço IP são só para as pessoas. Para o computador, um endereço IPv4 é **um único número de 32 bits**: as 4 partes são os 4 bytes dele. `192.168.1.1` são os bytes 192, 168, 1 e 1, que formam o número

192 × 256³ + 168 × 256² + 1 × 256 + 1 = **3.232.235.777**.

Leia um endereço IPv4 válido e imprima-o como número e como 32 bits.

**Entrada**

Um endereço IPv4 válido.

**Saída**

Duas linhas: `Number: ` e o endereço como número, e `Binary: ` e os 4 bytes dele com 8 bits cada, separados por pontos.

**O que você precisa saber**

- Trate as partes como dígitos na base 256: `value = value * 256 + parte` para cada parte, em ordem.
- Use `long`: a partir de 128.0.0.0 o número não cabe num `int`.
- Cada byte precisa ser escrito com exatamente 8 bits, então 1 vira `00000001`.
