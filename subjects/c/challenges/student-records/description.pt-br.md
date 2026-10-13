# Fichas de alunos

Um aluno é um nome e três notas, e um relatório precisa também da média: valores que andam juntos. Guardá-los em arrays paralelos, como na unidade de ponteiros, quer dizer que toda ordenação precisa mover vários arrays juntos. Uma `struct` guarda um aluno em **um** valor, então ordenar move fichas inteiras.

Leia os alunos, ordene-os pela média, a maior primeiro (médias iguais pelo nome), e imprima um relatório com a posição e um conceito:

Para a turma abaixo:

```
6
Ada 95 88 92
Alan 70 85 80
Grace 88 92 95
Linus 59 61 60
Barbara 80 80 80
Ken 100 100 69
```

```
 1. Ada                   91.67 A
 2. Grace                 91.67 A
 3. Ken                   89.67 B
 4. Barbara               80.00 B
 5. Alan                  78.33 C
 6. Linus                 60.00 D
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 100)
- Depois `n` linhas: um nome (1 a 20 caracteres, sem espaços) e três notas de 0 a 100

**Saída**

Uma linha por aluno, impressa com `"%2d. %-20s %6.2f %c\n"`: posição, nome, média e conceito. O conceito é `A` para média de 90 ou mais, `B` para 80, `C` para 70, `D` para 60, e `F` abaixo disso.

**Coisas para saber**

- `qsort(students, n, sizeof *students, compare)` ordena um array de structs; `compare` recebe ponteiros para duas delas.
- Dois alunos com as mesmas notas têm exatamente a mesma média, então empatam e vão pelo nome (`strcmp`).
- Um array de structs é indexado como sempre: `students[i].average`.
