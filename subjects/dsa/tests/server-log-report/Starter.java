void main() {
    int n = Integer.parseInt(IO.readln().trim());
    int[] times = new int[n];
    int[] users = new int[n];
    int[] latencies = new int[n];
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" +");
        times[i] = Integer.parseInt(parts[0]);
        users[i] = Integer.parseInt(parts[1]);
        latencies[i] = Integer.parseInt(parts[2]);
    }

    // TODO: build the seven lines of the report
}
