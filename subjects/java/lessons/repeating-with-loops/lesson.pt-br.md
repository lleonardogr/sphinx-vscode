## Em resumo

Um laço **for** repete um bloco um número conhecido de vezes: ele começa um contador, confere uma condição antes de cada volta e atualiza o contador depois dela. Um laço **while** repete enquanto sua condição for verdadeira, quando você não sabe de antemão quantas voltas serão.

```java
void main() {
    int start = Integer.parseInt(IO.readln());
    for (int i = start; i > 0; i--) {
        IO.println(i + "...");
    }
    IO.println("Decolar!");

    double savings = 100;
    int years = 0;
    while (savings < 200) {
        savings = savings * 1.1;
        years++;
    }
    IO.println("Dobrou em " + years + " anos");
}
```

`do { … } while (condição);` confere a condição depois do corpo, então o corpo sempre roda pelo menos uma vez.

**Cuidado:** `for (int i = 0; i < 5; i++)` roda 5 vezes, com `i` de 0 a 4. Com `<=` roda 6.

<!-- readings -->
