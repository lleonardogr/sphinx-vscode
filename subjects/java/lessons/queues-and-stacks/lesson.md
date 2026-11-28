## In short

A **queue** serves items in the order they arrived: first in, first out, like a line at the bank. A **stack** gives back the last item put in: last in, first out, like a pile of plates. `ArrayDeque` does both.

```java
void main() {
    Deque<String> line = new ArrayDeque<>();
    line.offer("Ana");                    // joins at the back
    line.offer("Bia");
    IO.println(line.poll() + " served, " + line + " waiting");

    Deque<String> undo = new ArrayDeque<>();
    undo.push("type a");                  // on top
    undo.push("type b");
    IO.println("undo " + undo.pop());     // the last action first

    Queue<Integer> urgent = new PriorityQueue<>(List.of(5, 1, 3));
    IO.println(urgent.poll());            // 1: the smallest comes out first
}
```

`peek` looks at the next item without taking it.

**Watch out:** on an empty deque, `poll` and `peek` return `null`, but `pop` throws an exception. Check `isEmpty()` first.

<!-- readings -->
