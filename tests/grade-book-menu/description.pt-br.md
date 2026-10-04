# Menu do diário de notas

Monte um aplicativo de **diário de notas** com menu. O professor adiciona notas, lista as notas e pede estatísticas e conceitos. Este teste combina **variáveis**, **condicionais**, **laços**, uma **lista** e os seus próprios **métodos**.

**O que o seu programa faz**

1. Imprime o menu **uma vez**, no início:

   ```
   === Grade Book ===
   1. Add grade
   2. List grades
   3. Statistics
   4. Letter grades
   0. Exit
   ```

2. Depois lê opções, uma por linha, até a opção ser `0`:

| Opção | Lê | Imprime |
|-------|----|---------|
| `1` | uma linha com uma nota inteira | `Added <nota>`, ou `Invalid grade` se ela não estiver entre `0` e `100` (a nota não é adicionada) |
| `2` | nada | `Grades: 80, 95, 70` (na ordem em que foram adicionadas) |
| `3` | nada | três linhas: `Average: 81.67` (duas casas decimais), `Highest: 95`, `Lowest: 70` |
| `4` | nada | uma linha por nota, na ordem: `80 -> B` |
| `0` | nada | `Goodbye!`, e o programa termina |
| qualquer outra | nada | `Invalid option` |

Quando **ainda não há notas**, as opções `2`, `3` e `4` imprimem `No grades yet`.

**Conceitos**

| Nota | Conceito |
|------|----------|
| 90 a 100 | A |
| 80 a 89 | B |
| 70 a 79 | C |
| 60 a 69 | D |
| abaixo de 60 | F |

**Exemplo**

Entrada:

```
2
1
80
1
95
1
120
3
4
0
```

Saída:

```
=== Grade Book ===
1. Add grade
2. List grades
3. Statistics
4. Letter grades
0. Exit
No grades yet
Added 80
Added 95
Invalid grade
Average: 87.50
Highest: 95
Lowest: 80
80 -> B
95 -> A
Goodbye!
```

**O que você precisa saber**

- `List<Integer> grades = new ArrayList<>();` guarda as notas entre uma opção e outra. Crie a lista **antes** do laço.
- Escreva um método como `String letter(int grade)` para deixar o laço do menu curto.
- `"Average: %.2f".formatted(average)` imprime duas casas decimais. Lembre de dividir como `double`.
