# Pontos como records

Um **record** é um jeito curto de escrever uma classe que só guarda dados. Esta linha:

```java
record Point(int x, int y) {}
```

já dá um construtor, os acessores `x()` e `y()`, e `toString`, `equals` e `hashCode` prontos. Acrescente dois métodos ao record:

- `double distanceTo(Point other)`: a distância em linha reta entre os dois pontos
- `Point translate(int dx, int dy)`: um ponto **novo** deslocado de `dx` e `dy`

O `main` está pronto. Para os pontos `(1, 2)` e `(4, 6)` deslocados por `3 4` ele imprime:

```
A = Point[x=1, y=2]
B = Point[x=4, y=6]
Distance: 5.00
A moved = Point[x=4, y=6]
A moved equals B: true
```

**Entrada**

- Linha 1: `x1 y1 x2 y2`
- Linha 2: `dx dy`

**O que você precisa saber**

- Records são **imutáveis**: os campos não mudam, então métodos como `translate` devolvem um record novo.
- A distância entre dois pontos é `√(dx² + dy²)`.
- O `equals` de um record compara os componentes, então dois pontos com o mesmo `x` e `y` são iguais.
