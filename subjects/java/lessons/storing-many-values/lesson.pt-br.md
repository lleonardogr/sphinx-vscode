## Em resumo

Um **array** guarda um número fixo de valores de um tipo, numerados de 0 a `length - 1`. Você lê ou muda um deles pelo **índice**: `steps[0]` é o primeiro.

```java
void main() {
    int n = Integer.parseInt(IO.readln());
    String[] parts = IO.readln().trim().split(" ");
    int[] steps = new int[n];
    for (int i = 0; i < n; i++) {
        steps[i] = Integer.parseInt(parts[i]);
    }
    for (int i = 1; i < steps.length; i++) {
        IO.println("Dia " + (i + 1) + ": " + (steps[i] - steps[i - 1]) + " em relação ao dia anterior");
    }
    for (int s : steps) {
        IO.println("*".repeat(s / 1000));
    }
    int[][] seats = new int[3][4]; // 3 fileiras de 4, todas 0
    seats[1][2] = 1;
}
```

`for (int s : steps)` visita cada valor quando você não precisa do índice. Um array 2D é um array de linhas: `seats[linha][coluna]`.

**Cuidado:** o último índice é `length - 1`. `steps[steps.length]` para o programa com uma `ArrayIndexOutOfBoundsException`.

<!-- readings -->
