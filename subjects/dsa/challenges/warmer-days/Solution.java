void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] parts = IO.readln().trim().split(" +");
    int[] temps = new int[n];
    for (int i = 0; i < n; i++) {
        temps[i] = Integer.parseInt(parts[i]);
    }
    // Days still waiting for a warmer one; their temperatures go down from bottom to top.
    Deque<Integer> waiting = new ArrayDeque<>();
    int longest = 0;
    int fromDay = -1;
    for (int today = 0; today < n; today++) {
        while (!waiting.isEmpty() && temps[waiting.peek()] < temps[today]) {
            int day = waiting.pop();
            int wait = today - day;
            if (wait > longest || (wait == longest && day < fromDay)) {
                longest = wait;
                fromDay = day;
            }
        }
        waiting.push(today);
    }
    IO.println("longest wait: " + longest);
    IO.println("from day: " + (fromDay < 0 ? "none" : String.valueOf(fromDay + 1)));
    IO.println("never warmer: " + waiting.size());
}
