# Ponto no polígono

Este endereço de entrega está dentro da área de entrega? O jogador clicou dentro do país no mapa? Mapas, jogos e programas de CAD perguntam o tempo todo se um **ponto está dentro de um polígono**. Pontos e polígonos são structs naturais: um `Point` tem `x` e `y`, um `Polygon` tem os vértices.

Leia um polígono, imprima a área e o perímetro, e depois diga para cada ponto consultado se ele está dentro:

```
polígono em L (0,0) (6,0) (6,2) (2,2) (2,5) (0,5)

Area: 18.00
Perimeter: 22.00
(1, 1) inside
(4, 1) inside
(4, 4) outside
(1, 4) inside
```

**Entrada**

- Linha 1: `n`, o número de vértices (3 ≤ n ≤ 100); depois `n` linhas com as coordenadas inteiras dos vértices (−1000 a 1000), em ordem ao redor do polígono, que não se cruza
- Depois `q` (1 ≤ q ≤ 100) e `q` pontos com coordenadas inteiras. Nenhum ponto consultado fica exatamente sobre um lado.

**Saída**

`Area: ` e `Perimeter: ` com 2 casas, e depois cada ponto como `(x, y)` seguido de `inside` ou `outside`.

**Coisas para saber**

- **Fórmula do cadarço:** a área é metade do valor absoluto da soma de `x₁·y₂ − x₂·y₁` em cada lado de (x₁, y₁) até (x₂, y₂), inclusive o lado que volta ao primeiro vértice.
- **Lançamento de raio:** a partir do ponto, imagine um raio indo para a direita. Ele cruza os lados do polígono um número ímpar de vezes exatamente quando o ponto está dentro.
- `hypot(dx, dy)`, de `<math.h>`, é o tamanho de um lado. Imprima as coordenadas com `%g`, que omite o `.0`.
