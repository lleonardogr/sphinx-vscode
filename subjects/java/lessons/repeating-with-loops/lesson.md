## In short

A **for** loop repeats a block a known number of times: it starts a counter, checks a condition before each round, and updates the counter after it. A **while** loop repeats as long as its condition is true, when you don't know in advance how many rounds it takes.

```java
void main() {
    int start = Integer.parseInt(IO.readln());
    for (int i = start; i > 0; i--) {
        IO.println(i + "...");
    }
    IO.println("Liftoff!");

    double savings = 100;
    int years = 0;
    while (savings < 200) {
        savings = savings * 1.1;
        years++;
    }
    IO.println("Doubled in " + years + " years");
}
```

`do { … } while (condition);` checks the condition after the body, so the body always runs at least once.

**Watch out:** `for (int i = 0; i < 5; i++)` runs 5 times, with `i` from 0 to 4. With `<=` it runs 6.

<!-- readings -->
