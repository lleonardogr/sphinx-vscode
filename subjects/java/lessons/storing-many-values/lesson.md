## In short

An **array** holds a fixed number of values of one type, numbered from 0 to `length - 1`. You read or change one with its **index**: `steps[0]` is the first.

```java
void main() {
    int n = Integer.parseInt(IO.readln());
    String[] parts = IO.readln().trim().split(" ");
    int[] steps = new int[n];
    for (int i = 0; i < n; i++) {
        steps[i] = Integer.parseInt(parts[i]);
    }
    for (int i = 1; i < steps.length; i++) {
        IO.println("Day " + (i + 1) + ": " + (steps[i] - steps[i - 1]) + " vs the day before");
    }
    for (int s : steps) {
        IO.println("*".repeat(s / 1000));
    }
    int[][] seats = new int[3][4]; // 3 rows of 4, all 0
    seats[1][2] = 1;
}
```

`for (int s : steps)` visits each value when you don't need the index. A 2D array is an array of rows: `seats[row][column]`.

**Watch out:** the last index is `length - 1`. `steps[steps.length]` stops the program with an `ArrayIndexOutOfBoundsException`.

<!-- readings -->
