# Olá, mundo!

Toda jornada em Java começa aqui. Escreva um programa que imprima exatamente:

```
Hello, World!
```

**O que você precisa saber**

- `IO.println(...)` imprime um texto e pula para a próxima linha. (O Java clássico usa `System.out.println(...)`.)
- Texto (uma `String`) fica entre aspas duplas: `"assim"`.
- O Java diferencia maiúsculas de minúsculas, e todo comando termina com ponto e vírgula `;`.

Os dois programas abaixo são aceitos:

```java
// Java moderno (25+)
void main() {
    IO.println("...");
}
```

```java
// Java clássico
public class Main {
    public static void main(String[] args) {
        System.out.println("...");
    }
}
```
