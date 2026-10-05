# Relatório da turma

Leia as notas de uma turma e imprima um relatório, usando **records** e **streams** (sem laços). Este teste junta **coleções**, **orientação a objetos** e a **Stream API**.

**Entrada**

- Linha 1: `n`, o número de notas (pelo menos 1)
- Depois, `n` linhas `STUDENT COURSE SCORE` (nomes de uma palavra, notas de 0 a 100). Um aluno tem no máximo uma nota por matéria.

**Saída**

1. `Students: s, courses: c`
2. Para cada matéria em ordem alfabética: `COURSE: average A, best NAME (SCORE)`. O best é a maior nota; no empate, o nome que vem primeiro na ordem alfabética.
3. `Top student: NAME (average A)`: a maior média entre todas as notas do aluno; no empate, o nome que vem primeiro na ordem alfabética.
4. `Below 60: nome (COURSE SCORE), …` ordenado pelo aluno e depois pela matéria, ou `Below 60: none`.

As médias têm uma casa decimal.

**Exemplo**

Entrada:

```
5
ana Math 90
bruno Math 45
ana Physics 80
carla Math 90
bruno Physics 70
```

Saída:

```
Students: 3, courses: 2
Math: average 75.0, best ana (90)
Physics: average 75.0, best ana (80)
Top student: carla (average 90.0)
Below 60: bruno (Math 45)
```

**O que você precisa saber**

- Um `record Grade(String student, String course, int score)` guarda uma linha da entrada.
- `Stream.generate(IO::readln).limit(n)` lê `n` linhas sem laço.
- `Collectors.groupingBy` (com `TreeMap::new` para chaves ordenadas), `averagingInt` e `joining` cobrem quase todo o relatório.
- `Comparator.comparingInt(...).reversed().thenComparing(...)` ordena por uma chave do maior para o menor e desempata por outra.
