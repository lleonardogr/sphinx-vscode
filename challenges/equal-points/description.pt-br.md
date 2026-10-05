# Pontos iguais (equals e hashCode)

`HashSet` e `HashMap` decidem se dois objetos são "o mesmo" usando `equals` e `hashCode`. A classe `Point` ainda não sobrescreve esses métodos, então dois pontos com as mesmas coordenadas contam como **diferentes**, e o programa abaixo dá respostas erradas.

Sobrescreva os dois métodos para que pontos com o mesmo `x` e `y` sejam iguais. O `main` está pronto; para os pontos `(1, 2) (3, 4) (1, 2) (0, 0) (1, 2)` ele deve imprimir:

```
Points read: 5
Unique points: 3
Most repeated: (1, 2) x3
Contains (0, 0): true
```

**Entrada**

- Linha 1: `n` (1 a 1000)
- Depois, `n` linhas com dois inteiros `x y`

**O que você precisa saber**

- Por padrão, `equals` confere se duas variáveis apontam para o **mesmo objeto**, e não se os objetos têm os mesmos valores.
- `equals` precisa receber um `Object`: `public boolean equals(Object o)`. Com `int` ou `Point` como tipo do parâmetro você estaria **sobrecarregando**, e o `HashSet` nunca chamaria esse método.
- **Objetos iguais precisam ter hash codes iguais.** Se você sobrescrever `equals` sem `hashCode`, o `HashSet` procura no lugar errado e continua vendo repetidos. `Objects.hash(x, y)` monta um bom hash code.
