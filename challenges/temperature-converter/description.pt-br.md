# Celsius para Fahrenheit

Converta uma temperatura de Celsius para Fahrenheit usando a fórmula:

```
F = C × 9 / 5 + 32
```

**Entrada**

Um número decimal `C`.

**Saída**

As duas temperaturas com **uma** casa decimal, neste formato:

```
25.0 C = 77.0 F
```

**O que você precisa saber**

- Variáveis `double` guardam números com casas decimais. `Double.parseDouble(texto)` transforma a linha lida em `double`.
- Com dois `int`, a `/` descarta os decimais: `9 / 5` é `1`. Escreva `9.0 / 5`, ou multiplique o `double` primeiro: `celsius * 9 / 5`.
- `"%.1f".formatted(valor)` (ou `System.out.printf` no Java clássico) imprime uma casa decimal.
