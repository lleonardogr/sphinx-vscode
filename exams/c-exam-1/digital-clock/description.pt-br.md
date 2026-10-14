# Relógio digital

Um aparelho conta os segundos desde a meia-noite; o mostrador dele exibe um relógio de 12 horas. Para cada contagem, imprima a hora como `hh:mm:ss AM` ou `hh:mm:ss PM`:

```
45296   →   12:34:56 PM
3661    →   01:01:01 AM
0       →   12:00:00 AM
```

**Entrada**

- Linha 1: `t` (1 ≤ t ≤ 100)
- Depois `t` linhas com um número de segundos desde a meia-noite (0 a 86399)

**Saída**

Uma linha por contagem: horas, minutos e segundos com 2 dígitos cada, separados por `:`, depois um espaço e `AM` (antes do meio-dia) ou `PM` (a partir do meio-dia). Meia-noite e meio-dia mostram a hora como `12`.

**Coisas para saber**

- `printf("%02d", n)` imprime `n` com pelo menos 2 dígitos, completando com zero.
- `<time.h>` não é permitido.
