# Conversor de tempo

Um cronômetro mostra o tempo como um número de segundos. Converta em horas, minutos e segundos, do jeito que um relógio mostraria.

Por exemplo, `3725` segundos são 1 hora, 2 minutos e 5 segundos.

**Entrada**

Um número inteiro de segundos `s` (0 ≤ s ≤ 1.000.000).

**Saída**

```
Hours: 1
Minutes: 2
Seconds: 5
```

**O que você precisa saber**

- `/` entre dois valores `int` descarta os decimais: `3725 / 3600` é `1`.
- `%` dá o que sobra: `3725 % 3600` é `125`.
- Uma hora tem `3600` segundos e um minuto tem `60`. As horas podem passar de 24.
