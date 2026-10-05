# area() sobrecarregado

O Java deixa vários métodos terem o mesmo nome, desde que os **parâmetros** sejam diferentes. Isso se chama **sobrecarga**. Complete os três métodos chamados `area`:

| Chamada | Forma | Fórmula |
|---------|-------|---------|
| `area(radius)` | círculo | `π × r²` |
| `area(width, height)` | retângulo | `width × height` |
| `area(a, b, c)` | triângulo de lados `a`, `b`, `c` | fórmula de Heron (abaixo) |

O `main` está pronto: ele lê formas e chama `area` com um, dois ou três números.

**Entrada**

- Linha 1: `t`, o número de formas
- Depois, `t` linhas: `circle r`, `rectangle w h` ou `triangle a b c` (sempre válidas)

**Saída**

`Area of the circle: 12.57`, com duas casas decimais.

**O que você precisa saber**

- O Java escolhe qual `area` rodar pelo **número e pelos tipos dos argumentos** da chamada.
- `Math.PI` é π e `Math.sqrt(x)` é a raiz quadrada de `x`.
- **Fórmula de Heron**: com `s = (a + b + c) / 2`, a área é `√(s(s − a)(s − b)(s − c))`.
