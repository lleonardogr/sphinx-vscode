record Process(String name, int need, int left) {}

void main() {
    String[] first = IO.readln().trim().split(" +");
    int n = Integer.parseInt(first[0]);
    int slice = Integer.parseInt(first[1]);
    Deque<Process> queue = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" +");
        int need = Integer.parseInt(parts[1]);
        queue.offer(new Process(parts[0], need, need));
    }
    int clock = 0;
    long totalWaiting = 0;
    while (!queue.isEmpty()) {
        Process p = queue.poll();
        int run = Math.min(slice, p.left());
        clock += run;
        if (p.left() > run) {
            queue.offer(new Process(p.name(), p.need(), p.left() - run));
        } else {
            IO.println(p.name() + " finishes at " + clock);
            totalWaiting += clock - p.need();
        }
    }
    IO.println(String.format("average waiting: %.2f", (double) totalWaiting / n));
}
