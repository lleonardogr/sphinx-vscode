# Área e perímetro do retângulo

Leia a **largura** e a **altura** de um retângulo (elas podem ter casas decimais) e imprima a área e o perímetro com **exatamente duas casas decimais**.

**Entrada**

Uma linha com dois números decimais: `largura altura`.

**Saída**

```
Area: <largura * altura>
Perimeter: <2 * (largura + altura)>
```

**O que você precisa saber**

- Use `double` para números com casas decimais. `Double.parseDouble(texto)` transforma um texto como `"2.5"` em `double`. (Java clássico: `scanner.nextDouble()`.)
- `IO.println("Area: %.2f".formatted(area));` imprime um número com duas casas decimais. (Java clássico: `System.out.printf("Area: %.2f%n", area);`)
- O programa sempre imprime decimais com ponto (`12.50`), nunca com vírgula.
