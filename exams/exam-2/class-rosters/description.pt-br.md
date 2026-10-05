# Listas de turmas

Uma escola registra quais alunos fazem quais turmas. Leia comandos e responda cada um:

| Comando | Imprime |
|---------|---------|
| `enroll STUDENT COURSE` | `Enrolled STUDENT in COURSE`, ou `STUDENT is already in COURSE` |
| `drop STUDENT COURSE` | `Dropped STUDENT from COURSE`, ou `STUDENT is not in COURSE` |
| `roster COURSE` | `COURSE: Ana, Bia` com os alunos em ordem alfabética, ou `COURSE has no students` |
| `courses STUDENT` | `STUDENT: Art, Math` com as turmas em ordem alfabética, ou `STUDENT has no courses` |

**Entrada**

- Linha 1: `n`, o número de comandos
- Depois, `n` comandos. Nomes e turmas são uma palavra só.

**Saída**

Uma linha por comando.

**O que você precisa saber**

- Você precisa responder perguntas **nas duas direções**, então guarde dois mapas: turma → alunos e aluno → turmas.
- Um `TreeSet` mantém os elementos ordenados e nunca repete um. `add` devolve `false` se o elemento já estava lá, e `remove` devolve `false` se não estava.
- Depois de um drop, uma turma (ou aluno) pode ficar com o set vazio: trate igual a nunca ter tido ninguém.
