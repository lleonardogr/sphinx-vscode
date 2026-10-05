void main() {
    Queue<String> line = new ArrayDeque<>();
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] p = IO.readln().trim().split(" ");
        switch (p[0]) {
            case "arrive" -> {
                line.offer(p[1]);
                IO.println(p[1] + " joined at position " + line.size());
            }
            case "serve" -> {
                String next = line.poll();
                IO.println(next == null ? "No one waiting" : "Serving " + next);
            }
            case "status" -> IO.println("Waiting: " + (line.isEmpty() ? "nobody" : String.join(", ", line)));
        }
    }
}
